import React from 'react';
import { Layout, Button, Input, Space } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Search } = Input;

interface NavbarProps {
  onSearch: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Header className="bg-white shadow-md px-6">
      <div className="flex justify-between items-center h-full">
        <div className="font-bold text-lg">
          <Link to="/" className="text-black no-underline">Product Management</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Search 
            placeholder="Search products" 
            allowClear
            onSearch={onSearch}
            style={{ width: 250 }}
          />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/add-product')}
              >
                Add Product
              </Button>
              
              <span>Hi, {user?.username}</span>
              
              <Button 
                icon={<LogoutOutlined />} 
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Space>
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                icon={<UserAddOutlined />}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </Space>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar; 