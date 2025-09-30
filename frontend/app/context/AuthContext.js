"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, removeCookie } from '@/app/utils/cookies';

const AuthContext = createContext({
    isAuthenticated: false,
    username: null,
    token: null,
    tokenType: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        username: null,
        token: null,
        tokenType: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const tokenType = localStorage.getItem('tokenType');

        if (token && username && tokenType) {
            setAuthState({
                isAuthenticated: true,
                username,
                token,
                tokenType,
            });
        }
    }, []);

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenType');
        
        // Clear cookies
        removeCookie('auth_token');
        removeCookie('username');
        removeCookie('token_type');
        
        // Reset auth state
        setAuthState({
            isAuthenticated: false,
            username: null,
            token: null,
            tokenType: null,
        });
        window.location.href = '/login';
    };

    const login = (data) => {
        // Set cookies
        setCookie('auth_token', data.token);
        setCookie('username', data.username);
        setCookie('token_type', data.tokenType);
        
        // Set localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('tokenType', data.tokenType);

        setAuthState({
            isAuthenticated: true,
            username: data.username,
            token: data.token,
            tokenType: data.tokenType,
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);