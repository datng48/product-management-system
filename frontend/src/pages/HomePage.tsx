import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Empty, Pagination, Spin, Alert, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProducts, searchProducts } from '../api';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 8,
    total: 0
  });

  const fetchProducts = useCallback(async (page: number, limit: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getProducts(page, limit);
      setProducts(response.items || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta.totalItems
      }));
    } catch (error) {
      setError(`Failed to load products: ${error}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      fetchProducts(pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize, searchQuery, fetchProducts]);

  const handleSearch = async (value: string): Promise<void> => {
    setSearchQuery(value);
    setLoading(true);
    setError(null);
    
    if (!value.trim()) {
      fetchProducts(1, pagination.pageSize);
      return;
    }
    
    try {
      const results = await searchProducts(value);
      setProducts(results || []);
      setPagination({
        ...pagination,
        current: 1,
        total: results.length
      });
    } catch (error) {
      console.error(`Search failed: ${error}`);
      setError('Search failed. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number): void => {
    setPagination({
      ...pagination,
      current: page
    });
  };

  const handleLikeUpdate = (productId: number, liked: boolean, likesCount: number): void => {
    setProducts(
      products.map(product => 
        product.id === productId 
          ? { ...product, liked, likesCount } 
          : product
      )
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar onSearch={handleSearch} />
      
      <Content className="max-w-7xl mx-auto p-6">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}
        
        {isLoggedIn && (
          <div className="flex justify-end mb-6">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/add-product')}
            >
              Add Product
            </Button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={product} 
                    onLikeUpdate={handleLikeUpdate} 
                  />
                </div>
              ))}
            </div>
            
            {!searchQuery && (
              <div className="text-center my-8">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        ) : (
          <Empty description="No data." />
        )}
      </Content>
    </Layout>
  );
};

export default HomePage; 