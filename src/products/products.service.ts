import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like as TypeOrmLike } from 'typeorm';
import { Product } from './entities/product.entity';
import { Like } from './entities/like.entity';
import { CreateProductDto, PaginationQueryDto } from './dto/product.dto';
import { User } from '../auth/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(query: PaginationQueryDto, user?: User) {
    const { page, limit } = query;
    
    const userSuffix = user ? `_user${user.id}` : '';
    const cacheKey = `products_page${page}_limit${limit}${userSuffix}`;
    
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const skip = (page - 1) * limit;
    
    const totalItems = await this.productRepository.count();
    
    const products = await this.productRepository.find({
      relations: ['likes'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });
    
    const transformedItems = await Promise.all(products.map(async (product: any) => {
      const { likes, ...rest } = product;
      
      let liked = false;
      if (user) {
        const userLike = await this.likeRepository.findOne({
          where: {
            product: { id: product.id },
            user: { id: user.id },
          },
        });
        liked = !!userLike;
      }
      
      return {
        ...rest,
        likesCount: likes?.length || 0,
        liked,
      };
    }));
    
    const result = {
      items: transformedItems,
      meta: {
        totalItems,
        itemCount: transformedItems.length,
        itemsPerPage: +limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: +page,
      },
      links: {
        first: `products?page=1&limit=${limit}`,
        previous: page > 1 ? `products?page=${page-1}&limit=${limit}` : '',
        next: page < Math.ceil(totalItems / limit) ? `products?page=${+page+1}&limit=${limit}` : '',
        last: `products?page=${Math.ceil(totalItems / limit)}&limit=${limit}`,
      }
    };
    
    await this.cacheManager.set(cacheKey, result, 60 * 5);
    
    return result;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    await this.cacheManager.del('products_page*');
    await this.cacheManager.del('search_*');
    return product;
  }

  async search(query: string, user?: User) {
    const userSuffix = user ? `_user${user.id}` : '';
    const cacheKey = `search_${query}${userSuffix}`;
    
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const products = await this.productRepository.find({
      where: { name: TypeOrmLike(`%${query}%`) },
      relations: ['likes'],
      order: { createdAt: 'DESC' }
    });
    
    const results = await Promise.all(products.map(async (product: any) => {
      const { likes, ...rest } = product;
      
      let liked = false;
      if (user) {
        const userLike = await this.likeRepository.findOne({
          where: {
            product: { id: product.id },
            user: { id: user.id },
          },
        });
        liked = !!userLike;
      }
      
      return {
        ...rest,
        likesCount: likes?.length || 0,
        liked,
      };
    }));
    
    await this.cacheManager.set(cacheKey, results, 60 * 5);
    
    return results;
  }

  async toggleLike(productId: number, user: User) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    const existingLike = await this.likeRepository.findOne({
      where: {
        product: { id: productId },
        user: { id: user.id },
      },
    });
    
    let liked = false;
    
    try {
      if (existingLike) {
        await this.likeRepository.remove(existingLike);
        liked = false;
      } else {
        const newLike = new Like();
        newLike.product = product;
        newLike.user = user;
        
        const savedLike = await this.likeRepository.save(newLike);
        liked = true;
      }
      await this.cacheManager.del('products_page*');
      await this.cacheManager.del('search_*');
      
    } catch (error) {
      throw error;
    }
    
    const likeCount = await this.likeRepository.count({
      where: { product: { id: productId } },
    });
    
    return {
      liked,
      likesCount: likeCount,
    };
  }
} 