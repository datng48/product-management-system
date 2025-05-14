import { Field, InputType, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  subcategory: string;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  price?: number;

  @Field({ nullable: true })
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsString()
  subcategory?: string;
}

@InputType()
export class ProductFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  subcategory?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 8 })
  @IsOptional()
  limit?: number;
} 