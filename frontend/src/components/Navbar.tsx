import React, { useEffect, useState } from 'react';
import { Layout, Button, Input, Space } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { t, onLanguageChange } from '../utils/i18n';

const { Header } = Layout;
const { Search } = Input;

interface NavbarProps {
  onSearch: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [, setUpdate] = useState(0);

  // Force update when language changes
  useEffect(() => {
    const unsubscribe = onLanguageChange(() => {
      setUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  return (
    <Header className="bg-white shadow-md px-6">
      <div className="flex justify-between items-center h-full">
        <div className="font-bold text-lg">
          <Link to="/" className="text-black no-underline">
            {t('app.title')}
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Search 
            placeholder={t('products.search')}
            allowClear
            onSearch={onSearch}
            style={{ width: 250 }}
          />
          
          <LanguageSwitcher />
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/add-product')}
              >
                {t('products.createNew')}
              </Button>
              
              <span>Hi, {user?.username}</span>
              
              <Button 
                icon={<LogoutOutlined />} 
                onClick={logout}
              >
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <Space>
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={() => navigate('/login')}
              >
                {t('nav.login')}
              </Button>
              <Button
                icon={<UserAddOutlined />}
                onClick={() => navigate('/register')}
              >
                {t('nav.register')}
              </Button>
            </Space>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar; 