import { useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext } from "./auth";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // 初始化时验证token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 验证token是否有效
          const response = await axios.post('/api/verifyToken', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Token verification response:', response.data);
          
          if (response.data.success) {
            setIsAuthenticated(true);
            setUsername(response.data.username);
            setUserId(response.data.userId);
            setIsAdmin(response.data.isAdmin);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
        }
      } else {
        console.log('No token found');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, username, userId, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
