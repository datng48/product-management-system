import { Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import { ReactNode } from 'react';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token !== null && user !== null;
};

interface RouteType {
  path: string;
  element: ReactNode;
}

const routes: RouteType[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: !isAuthenticated() ? <Login /> : <Navigate to="/" />,
  },
  {
    path: '/register',
    element: !isAuthenticated() ? <Register /> : <Navigate to="/" />,
  },
  {
    path: '/add-product',
    element: isAuthenticated() ? <AddProduct /> : <Navigate to="/login" />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default routes; 