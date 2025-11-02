import axios from 'axios';

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResposne {
    success: boolean;
    message: string;
    token: string;
}

export async function login(values: LoginForm): Promise<LoginResposne> {
  try {
    const response = await axios.post('/api/login', {
      username: values.username,
      password: values.password,
    });
    
    console.log('Login response:', response.data);

    return response.data;
  } catch (error: unknown) {
    console.error('Login failed:', error);
    
    const errorMessage = '登录失败';
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    
    // 添加默认返回值以修复TS2366错误
    return {success: false, message: errorMessage, token: ''};
  }
}