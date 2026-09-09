import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/me');
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (loginId, password) => {
        await axios.get('/sanctum/csrf-cookie'); // Importante para SPA
        const response = await api.post('/login', { login: loginId, password });
        setUser(response.data.user);
    };

    const register = async (data) => {
        await axios.get('/sanctum/csrf-cookie');
        const response = await api.post('/register', data);
        setUser(response.data.user);
    };

    const updateProfile = async (data) => {
        const response = await api.put('/me', data);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
