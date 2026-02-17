'use client';

import { AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';

export default function AuthProviderWrapper({ children }) {
    return (
        <AuthProvider>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </AuthProvider>
    );
}