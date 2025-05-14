import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Product } from './product.entity';

@Entity('likes')
@Unique(['user', 'product'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, product => product.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
} 