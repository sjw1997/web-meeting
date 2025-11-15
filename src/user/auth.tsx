import axios from 'axios';
import { createContext, useContext } from "react";

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResposne {
    success: boolean;
    message: string;
    token: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  username: string;
  userId: string;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
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