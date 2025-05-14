import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsResolver } from './resolvers/products.resolver';
import { Product } from './entities/product.entity';
import { Like } from './entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Like]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {} 