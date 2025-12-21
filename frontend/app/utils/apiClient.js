'use client';

const BASE_URL = 'http://localhost:8080';

// Helper to handle response
const handleResponse = async (response) => {
    if (response.status === 401) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenType');
        
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
        throw new Error(await response.text() || 'Request failed');
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
};

export const apiClient = {
    get: async (endpoint) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    put: async (endpoint, data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response,"delete request");
            return handleResponse(response);
        } catch (error) {
            console.error('Delete request failed:', error);
            throw error;
        }
    }
};