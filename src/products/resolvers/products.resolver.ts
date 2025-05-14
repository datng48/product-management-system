import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from '../products.service';
import { ProductModel } from '../models/product.model';
import { PaginatedProductsModel } from '../models/paginated-products.model';
import { ProductFilterInput, CreateProductInput } from '../dto/product.input';

@Resolver(() => ProductModel)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => PaginatedProductsModel)
  async products(
    @Args('filters', { nullable: true }) filters?: ProductFilterInput
  ): Promise<any> {
    const queryParams = {
      page: filters?.page || 1,
      limit: filters?.limit || 8
    };
    
    return this.productsService.findAll(queryParams);
  }

  @Query(() => [ProductModel])
  async searchProducts(
    @Args('query') query: string
  ): Promise<any> {
    return this.productsService.search(query);
  }

  @Mutation(() => ProductModel)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput
  ): Promise<any> {
    return this.productsService.create(createProductInput);
  }
} 