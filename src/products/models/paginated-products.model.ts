import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/models/pagination.model';
import { ProductModel } from './product.model';

@ObjectType()
export class PaginatedProductsModel extends Paginated(ProductModel) {} 