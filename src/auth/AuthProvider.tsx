import { useEffect, useState } from "react";
import { AuthContext } from "./auth";
import axios from 'axios';

const AuthProvider = ({ children }: { children: React.ReactNode }) => { 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.post('/api/verifyToken', {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log(response.data);
                    if (response.data.success) {
                        setIsAuthenticated(true);
                        setUserId(response.data.userId);
                        setUsername(response.data.username);
                        setIsAdmin(response.data.isAdmin);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        }

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, username, isLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;