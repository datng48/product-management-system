import React, { useState } from 'react';
import { Form, Input, Button, Card, InputNumber, Select, Typography, Alert, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api';
import Navbar from '../components/Navbar';

const { Option } = Select;
const { Title } = Typography;
const { Content } = Layout;

const categories = [
  { value: 'Electronics', subcategories: ['Phones', 'Laptops', 'Macbook'] },
  { value: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  { value: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Educational'] },
  { value: 'Home', subcategories: ['Kitchen', 'Furniture', 'Decor'] },
];

const AddProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = {
        ...values,
        price: typeof values.price === 'string' 
          ? parseFloat(values.price.replace(/[^\d.]/g, '')) 
          : values.price
      };
      
      await createProduct(formData);
      form.resetFields();
      navigate('/');
    } catch (error) {
      setError(`Failed to add product: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setFieldsValue({ subcategory: undefined });
  };

  const getSubcategories = () => {
    const category = categories.find(c => c.value === selectedCategory);
    return category ? category.subcategories : [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar onSearch={() => {}} />
      
      <Content className="app-container">
        <Card style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Add New Product</Title>
          
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                { required: true, message: 'Please enter product name' },
                { min: 3, message: 'Name must be at least 3 characters' }
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
            
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: 'Please enter price' },
                { 
                  validator: (_, value) => {
                    if (!value || typeof value === 'number' && value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Price must be greater than 0'));
                  }
                }
              ]}
            >
              <InputNumber
                step={0.01}
                precision={2}
                style={{ width: '100%' }}
                addonBefore="$"
                placeholder="Enter price"
              />
            </Form.Item>
            
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select 
                placeholder="Select category"
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <Option key={category.value} value={category.value}>{category.value}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="subcategory"
              label="Subcategory"
              rules={[{ required: true, message: 'Please select subcategory' }]}
            >
              <Select 
                placeholder={selectedCategory ? "Select subcategory" : "Please select a category first"}
                disabled={!selectedCategory}
              >
                {getSubcategories().map(sub => (
                  <Option key={sub} value={sub}>{sub}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Add Product
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default AddProduct; 