import { Field, ID, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field()
  subcategory: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
  
  @Field(() => Int, { defaultValue: 0 })
  likesCount: number;
} 