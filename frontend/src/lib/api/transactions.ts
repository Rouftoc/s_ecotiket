import { ApiResponse } from './types';
import { API_BASE_URL, createHeaders, handleResponse } from './core';

export const transactionsAPI = {
    async getBottleRates(): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/bottle-rates`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching bottle rates:', error);
            throw error;
        }
    },

    async processBottleExchange(data: {
        userQrCode: string;
        bottleType: string;
        bottleCount: number;
        location?: string;
    }): Promise<ApiResponse> {
        try {
            console.log('Processing bottle exchange:', data);

            const response = await fetch(`${API_BASE_URL}/transactions/bottle-exchange`, {
                method: 'POST',
                headers: createHeaders(),
                body: JSON.stringify({
                    userQrCode: data.userQrCode,
                    bottleType: data.bottleType,
                    bottleCount: data.bottleCount,
                    location: data.location
                })
            });

            const result = await handleResponse(response);
            console.log('Bottle exchange result:', result);

            return result;
        } catch (error) {
            console.error('Error in processBottleExchange:', error);
            throw error;
        }
    },

    async processBulkBottleExchange(data: {
        userQrCode: string;
        bottles: Array<{
            type: string;
            count: number;
        }>;
        location?: string;
    }): Promise<ApiResponse> {
        try {
            console.log('Processing bulk bottle exchange:', data);

            const response = await fetch(`${API_BASE_URL}/transactions/bulk-bottle-exchange`, {
                method: 'POST',
                headers: createHeaders(),
                body: JSON.stringify({
                    userQrCode: data.userQrCode,
                    bottles: data.bottles,
                    location: data.location
                })
            });

            const result = await handleResponse(response);
            console.log('Bulk bottle exchange result:', result);

            return result;
        } catch (error) {
            console.error('Error in processBulkBottleExchange:', error);

            if (error instanceof Error && error.message.includes('404')) {
                console.log('Bulk endpoint not available, falling back to individual processing');

                let totalTickets = 0;
                let totalPoints = 0;

                for (const bottle of data.bottles) {
                    if (bottle.count > 0) {
                        const result = await this.processBottleExchange({
                            userQrCode: data.userQrCode,
                            bottleType: bottle.type,
                            bottleCount: bottle.count,
                            location: data.location
                        });

                        if (result.tickets_earned) totalTickets += result.tickets_earned;
                        if (result.points_earned) totalPoints += result.points_earned;
                    }
                }

                return {
                    success: true,
                    message: 'Bottles processed successfully',
                    tickets_earned: totalTickets,
                    points_earned: totalPoints
                };
            }

            throw error;
        }
    },

    async processTicketUsage(data: {
        userQrCode: string;
        ticketCount: number;
        location?: string;
    }): Promise<ApiResponse> {
        try {
            console.log('Processing ticket usage:', data);

            const response = await fetch(`${API_BASE_URL}/transactions/ticket-usage`, {
                method: 'POST',
                headers: createHeaders(),
                body: JSON.stringify({
                    userQrCode: data.userQrCode,
                    ticketCount: data.ticketCount,
                    location: data.location
                })
            });

            const result = await handleResponse(response);
            console.log('Ticket usage result:', result);

            return result;
        } catch (error) {
            console.error('Error in processTicketUsage:', error);
            throw error;
        }
    },

    async getTransactionsByUserId(userId: number): Promise<ApiResponse> {
        try {
            console.log('Fetching transactions for user:', userId);

            const response = await fetch(`${API_BASE_URL}/transactions/user/${userId}`, {
                headers: createHeaders()
            });

            const result = await handleResponse(response);
            console.log('User transactions fetched:', result);

            return result;
        } catch (error) {
            console.error('Error fetching user transactions:', error);
            return {
                success: false,
                transactions: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    async getUserTransactions(userId: number): Promise<ApiResponse> {
        return this.getTransactionsByUserId(userId);
    },

    async getAllTransactions(filters?: {
        type?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): Promise<ApiResponse> {
        try {
            console.log('Fetching transactions with filters:', filters);

            const params = new URLSearchParams();
            if (filters?.type) params.append('type', filters.type);
            if (filters?.startDate) params.append('startDate', filters.startDate);
            if (filters?.endDate) params.append('endDate', filters.endDate);
            if (filters?.limit) params.append('limit', filters.limit.toString());

            const response = await fetch(`${API_BASE_URL}/transactions?${params}`, {
                headers: createHeaders()
            });

            const result = await handleResponse(response);
            console.log('Transactions fetched:', result);

            return result;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return {
                success: false,
                transactions: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    async deleteTransaction(id: number): Promise<ApiResponse> {
        try {
            console.log('Deleting transaction:', id);

            const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
                method: 'DELETE',
                headers: createHeaders()
            });

            const result = await handleResponse(response);
            console.log('Transaction deleted:', result);

            return result;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }
};
