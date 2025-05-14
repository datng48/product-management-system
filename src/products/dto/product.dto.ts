import { IsNotEmpty, IsNumber, IsPositive, IsString, Min, Max, MaxLength, MinLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  category: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  subcategory: string;
}

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;
} 