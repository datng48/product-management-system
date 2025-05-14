import React from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterFormData } from '../types';

const { Title, Text } = Typography;

interface RegisterFormValues extends RegisterFormData {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const [form] = Form.useForm<RegisterFormValues>();

  const onFinish = (values: RegisterFormValues): void => {
    const { username, password } = values;
    register({ username, password });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ width: 400, padding: '20px' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Text>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 