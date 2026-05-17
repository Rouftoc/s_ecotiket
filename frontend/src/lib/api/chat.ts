import axios from 'axios';
const API_URL = 'http://localhost:5000/api/chat';

const chatApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

chatApi.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
                // Debug: log first 20 chars of token to verify it exists
                console.log('Chat API: Using token:', user.token.substring(0, 20) + '...');
                console.log('Chat API: User role:', user.role);
            } else {
                console.warn('Chat API: No token in user object');
            }
        } catch (e) {
            console.error('Chat API: Failed to parse user from localStorage', e);
        }
    } else {
        console.warn('Chat API: No user in localStorage');
    }
    return config;
});

// Response interceptor to handle auth errors
chatApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            console.error('Chat API 403 Error:', error.response?.data);
            // Check if it's a role issue
            if (error.response?.data?.error === 'Insufficient permissions') {
                console.error('Chat API: User role does not have permission for this endpoint');
            }
        }
        return Promise.reject(error);
    }
);

export const chatAPI = {
    // User
    sendMessage: async (message: string) => {
        const response = await chatApi.post('/send', { message });
        return response.data;
    },
    getMessages: async () => {
        const response = await chatApi.get('/messages');
        return response.data;
    },

    // Admin
    getAllSessions: async () => {
        const response = await chatApi.get('/sessions');
        return response.data;
    },
    getSessionMessages: async (sessionId: number) => {
        const response = await chatApi.get(`/sessions/${sessionId}/messages`);
        return response.data;
    },
    adminReply: async (sessionId: number, message: string) => {
        const response = await chatApi.post(`/sessions/${sessionId}/reply`, { message });
        return response.data;
    },
    closeSession: async (sessionId: number) => {
        const response = await chatApi.patch(`/sessions/${sessionId}/close`);
        return response.data;
    }
};
