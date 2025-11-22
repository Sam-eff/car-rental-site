import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../store/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app load
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Fetch user profile
            authApi.getProfile()
                .then(response => {
                    // console.log('User profile:', response.data)
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    // Token invalid or expired
                    localStorage.removeItem('access_token');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            // Get token
            const response = await authApi.login({ username, password });
            const { access } = response.data;
            
            // Store token
            localStorage.setItem('access_token', access);
            
            // Get user profile
            const profileResponse = await authApi.getProfile();
            setUser(profileResponse.data);
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || 'Login failed' 
            };
        }
    };

    const register = async (userData) => {
        try {
            // console.log('Sending registration data:', userData);
            
            const response = await authApi.register(userData);

            // console.log('Registration response:', response); 
            
            // After registration, automatically log in
            return await login(userData.username, userData.password);
        } catch (error) {
            console.error('Registration error:', error.response?.data); // Debug
            return { 
                success: false, 
                error: error.response?.data || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};