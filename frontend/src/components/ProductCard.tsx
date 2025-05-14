import React, { useState } from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { toggleLike } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

const { Text, Title } = Typography;

interface ProductCardProps {
  product: Product;
  onLikeUpdate?: (productId: number, liked: boolean, likesCount: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onLikeUpdate }) => {
  const { isLoggedIn } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(product.liked || false);
  const [likesCount, setLikesCount] = useState<number>(product.likesCount || 0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const handleLike = async (): Promise<void> => {
    if (!isLoggedIn) return;
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsLiking(true);
    
    try {
      const response = await toggleLike(product.id);
      setIsLiked(response.liked);
      setLikesCount(response.likesCount);
      
      if (onLikeUpdate) {
        onLikeUpdate(product.id, response.liked, response.likesCount);
      }
    } catch {
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <Title level={4} className="mb-2">{product.name}</Title>
        <Text strong className="mb-2">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</Text>
        
        <div className="my-3">
          <Tag color="blue" className="mr-2">{product.category}</Tag>
          <Tag color="green">{product.subcategory}</Tag>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4">
          <Text type="secondary">
            {new Date(product.createdAt).toLocaleDateString()}
          </Text>
          
          <Button 
            type={isLiked ? 'primary' : 'default'} 
            icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
            onClick={handleLike}
            disabled={!isLoggedIn || isLiking}
          >
            {likesCount}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard; 