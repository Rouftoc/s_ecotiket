import { authAPI } from './auth';

// Export everything from sub-modules
export * from './types';
export * from './core';
export * from './auth';
export * from './users';
export * from './transactions';
export * from './locations';
export * from './news';
export * from './shifts';
export * from './notifications';
export * from './bottleRates';

// Helper for debugging, needs re-import of authAPI to avoid circular dependency issues if wrapped in debugAPI logic
import { checkBackendHealth, getAuthToken } from './core';
import { authAPI as auth } from './auth';

export const debugAPI = async (): Promise<void> => {
    console.log('Debugging API connectivity...');

    try {
        const healthCheck = await checkBackendHealth();
        console.log('Backend health:', healthCheck ? 'Online' : 'Offline');

        const token = getAuthToken();
        console.log('Auth token:', token ? 'Present' : 'Missing');

        if (token) {
            const profileResponse = await auth.getProfile();
            console.log('Profile check:', profileResponse.user ? 'Valid' : 'Invalid');
        }
    } catch (error) {
        console.error('API Debug Error:', error);
    }
};
