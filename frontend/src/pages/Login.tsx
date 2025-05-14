import React from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormData } from '../types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const onFinish = (values: LoginFormData): void => {
    login(values);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ width: 400, padding: '20px' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Sign In</Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
          Or <Link to="/register">create a new account</Link>
        </Text>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 