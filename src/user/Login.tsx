import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login, type LoginForm } from './auth';
import RootLayout from '../components/RootLayout';

const { Title } = Typography;


const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    console.log('Received values of form: ', values);
    setLoading(true);

    const response = await login(values);
    if (response.success) {
      messageApi.open({
          type: 'success',
          content: '登录成功',
      });

      localStorage.setItem('token', response.token);
      setTimeout(() => {navigate('/')}, 1500);
    } else {
      messageApi.open({
          type: 'error',
          content: response.message,
      });
    }
    setLoading(false);
  };

  return (
    <RootLayout>
      {contextHolder}
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={20} sm={16} md={12} lg={8}>
            <Card>
            <Title level={2} style={{ textAlign: 'center' }}>用户登录</Title>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
                >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                </Form.Item>
                <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
                >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                />
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} block>
                    登录
                </Button>
                或 <Link to="/register">注册</Link>
                </Form.Item>
            </Form>
            </Card>
        </Col>
      </Row>
    </RootLayout>
  );
};

export default Login;