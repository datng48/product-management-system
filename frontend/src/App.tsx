import React, { useState, useEffect } from 'react';
import { BrowserRouter, useRoutes, useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import routes from './routes';
import './index.css';

const AppRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token !== null && user !== null;
  });
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(token !== null && user !== null);
  }, [location]);
  
  const routing = useRoutes(routes);
  return routing;
};

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App; 