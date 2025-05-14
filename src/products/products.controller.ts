import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto, PaginationQueryDto } from './dto/product.dto';
import { Request } from 'express';
import { User } from '../auth/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns paginated list of products'
  })
  findAll(@Query() query: PaginationQueryDto, @Req() req: Request) {
    console.log('Request user:', req.user ? 'exists' : 'not present');
    const user = req.user as User;
    return this.productsService.findAll(query, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Search products by name' })
  search(@Query('q') query: string, @Req() req: Request) {
    console.log('Search request user:', req.user ? 'exists' : 'not present');
    const user = req.user as User;
    return this.productsService.search(query, user);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like or unlike a product' })
  @UseGuards(AuthGuard('jwt'))
  toggleLike(@Param('id') id: number, @Req() req: Request) {
    console.log('Toggle like request user:', req.user ? 'exists' : 'not present');
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    return this.productsService.toggleLike(id, req.user as User);
  }
} 