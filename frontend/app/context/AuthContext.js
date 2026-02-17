"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, removeCookie } from '@/app/utils/cookies';

const AuthContext = createContext({
    isAuthenticated: false,
    username: null,
    userId: null,
    token: null,
    tokenType: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        username: null,
        userId: null,
        token: null,
        tokenType: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const tokenType = localStorage.getItem('tokenType');
        const userId = localStorage.getItem('userId');

        if (token && username && tokenType) {
            setAuthState({
                isAuthenticated: true,
                username,
                userId: userId ? Number(userId) : null,
                token,
                tokenType,
            });
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('userId');

        removeCookie('auth_token');
        removeCookie('username');
        removeCookie('token_type');

        setAuthState({
            isAuthenticated: false,
            username: null,
            userId: null,
            token: null,
            tokenType: null,
        });
        window.location.href = '/login';
    };

    const login = (data) => {
        setCookie('auth_token', data.token);
        setCookie('username', data.username);
        setCookie('token_type', data.tokenType);

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('tokenType', data.tokenType);
        if (data.userId) {
            localStorage.setItem('userId', String(data.userId));
        }

        setAuthState({
            isAuthenticated: true,
            username: data.username,
            userId: data.userId ? Number(data.userId) : null,
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