import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, IdcardOutlined, SolutionOutlined, ApartmentOutlined  } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { login } from './auth';
import type { DepartmentInfo } from '../user/DepartmentManagement';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();


  useEffect(() => {
    const fetchDepartments = async () => {
      const departmentResponse = await axios.get('/api/department/get');
      setDepartments(departmentResponse.data.departments);
    };
    fetchDepartments();
  }, []);

  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('Received values of form: ', values);
    setLoading(true);
    
    try {
      const response = await axios.post('/api/register', values);
      
      console.log('Register response:', response.data);

      if (response.data.success) {
        messageApi.open({
            type: 'success',
            content: '注册成功',
        });

        const loginRresponse = await login({
          username: values.username,
          password: values.password
        });

        if (loginRresponse.success) {
          messageApi.open({
              type: 'success',
              content: '登录成功',
          });
    
          localStorage.setItem('token', loginRresponse.token);
          setTimeout(() => {window.location.replace("/");}, 1500);
        } else {
          messageApi.open({
              type: 'error',
              content: loginRresponse.message,
          });
        }
      } else {
        messageApi.open({
            type: 'error',
            content: response.data.message,
        });
      }
    } catch (error: unknown) {
      console.error('Register failed:', error);
      let errorMessage = '注册失败';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Row justify="center" align="middle" style={{ height: '80vh' }}>
        <Col xs={20} sm={16} md={12} lg={8}>
            <Card>
            <Title level={2} style={{ textAlign: 'center' }}>用户注册</Title>
            <Form
              form={form}
              name="normal_register"
              className="register-form"
              initialValues={{ }}
              onFinish={onFinish}
            >
                <Form.Item
                name="username"
                rules={[
                    { required: true, message: '请输入用户名!' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' }
                ]}
                >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                </Form.Item>
                
                <Form.Item
                name="password"
                rules={[
                    { required: true, message: '请输入密码!' },
                    { min: 6, message: '密码至少6个字符' }
                ]}
                >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                />
                </Form.Item>
                
                <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    { required: true, message: '请确认密码!' },
                    ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致!'));
                    },
                    }),
                ]}
                >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="确认密码"
                />
                </Form.Item>

                <Form.Item name="name" rules={[{ required: true, message: '请输入姓名!' }]}>
                  <Input prefix={<IdcardOutlined className="site-form-item-icon" />} placeholder="姓名" />
                </Form.Item>

                <Form.Item name="workNum" rules={[{ required: true, message: '请输入工号!' }]}>
                  <Input prefix={<SolutionOutlined className="site-form-item-icon" />} placeholder="工号" />
                </Form.Item>

                <Form.Item name="phoneNum" rules={[{ required: true, message: '请输入手机号!' }]}>
                  <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="手机号" />
                </Form.Item>

                <Form.Item name="departmentId" rules={[{ required: true, message: '请选择部门!' }]}>
                  <Select
                    placeholder="部门"
                    suffixIcon={<ApartmentOutlined style={{ color: '#bfbfbf' }} />} // 使用部门图标替换默认箭头
                    options={departments.map(department => ({ label: department.name, value: department.id }))}
                  />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" className="register-form-button" loading={loading} block>
                    注册
                </Button>
                或 <Link to="/login">登录</Link>
                </Form.Item>
            </Form>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default Register;