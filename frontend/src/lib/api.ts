const API_BASE_URL = 'http://192.168.2.13:5000/api';

interface User {
  id: number;
  email?: string;
  nik?: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  qrCode: string;
  qr_code: string;
  ticketsBalance: number;
  tickets_balance: number;
  points: number;
  status: string;
  created_at: string;
  token?: string;
}

interface Location {
  id: number;
  name: string;
  type: 'terminal' | 'koridor' | 'stand';
  address: string;
  coordinates?: string;
  description?: string;
  capacity?: number;
  status: 'active' | 'inactive' | 'maintenance';
  operating_hours?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T = unknown> {
  message?: string;
  user?: User;
  users?: User[];
  transactions?: Transaction[];
  announcements?: Announcement[];
  rates?: BottleRate[];
  locations?: Location[]; 
  location?: Location; 
  token?: string;
  success?: boolean;
  error?: string;
  tickets_earned?: number;
  points_earned?: number;
  total?: number;
  filtered?: boolean;
  deletedTransaction?: Transaction;
  [key: string]: unknown;
}

interface Transaction {
  id: number;
  user_id: number;
  petugas_id: number;
  type: string;
  description: string;
  bottles_count?: number;
  bottle_type?: string;
  tickets_change: number;
  points_earned?: number;
  location?: string;
  status: string;
  created_at: string;
  user_name?: string;     
  petugas_name?: string;   
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  is_active: boolean;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

interface BottleRate {
  id: number;
  bottle_type: string;
  bottles_required: number;
  tickets_earned: number;
  points_earned: number;
  is_active: boolean;
}

const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user) as User;
      return userData.token;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const normalizeUserData = (userData: Record<string, unknown>): User => {
  return {
    id: Number(userData.id) || 0,
    email: userData.email as string || '',
    nik: userData.nik as string || '',
    name: userData.name as string || 'Unknown',
    role: userData.role as string || 'penumpang',
    phone: userData.phone as string || '',
    address: userData.address as string || '',
    qrCode: (userData.qrCode || userData.qr_code || `ECO-${userData.id}`) as string,
    qr_code: (userData.qr_code || userData.qrCode || `ECO-${userData.id}`) as string,
    ticketsBalance: Number(userData.ticketsBalance ?? userData.tickets_balance ?? 0),
    tickets_balance: Number(userData.tickets_balance ?? userData.ticketsBalance ?? 0),
    points: Number(userData.points ?? 0),
    status: userData.status as string || 'active',
    created_at: userData.created_at as string || new Date().toISOString(),
    token: userData.token as string
  };
};

const handleResponse = async <T = unknown>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type');
  
  try {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const textError = await response.text();
        if (textError) errorMessage = textError;
      }
      
      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (data.user) {
        data.user = normalizeUserData(data.user);
      }
      if (data.users && Array.isArray(data.users)) {
        data.users = data.users.map(normalizeUserData);
      }
      
      return data;
    } else {
      return { message: 'Success', success: true };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse response');
  }
};

export const authAPI = {
  async login(email?: string, password?: string, qrCode?: string, nik?: string): Promise<ApiResponse> {
    const body: Record<string, string> = {};
    if (qrCode) {
      body.qrCode = qrCode;
    } else if (email && password) {
      body.email = email;
      body.password = password;
    } else if (nik && password) {
      body.nik = nik;
      body.password = password;
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  async register(userData: {
    email?: string;
    nik?: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    address?: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async getProfile(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  }
};

export const usersAPI = {
  async getAllUsers(filters?: { role?: string; status?: string; search?: string }): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      console.log('Fetching users with filters:', filters);
      
      const response = await fetch(`${API_BASE_URL}/users?${params}`, {
        headers: createHeaders()
      });
      
      const result = await handleResponse(response);
      console.log('Users fetched:', result);
      
      return result;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return {
        success: false,
        users: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async getUserById(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  async getUserByQrCode(qrCode: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/qr/${encodeURIComponent(qrCode)}`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching user by QR code:', error);
      throw error;
    }
  },

  async updateProfile(userData: {
    name: string;
    phone?: string;
    address?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async updateUser(id: number, userData: {
    name?: string;
    email?: string;
    nik?: string;
    phone?: string;
    address?: string;
    status?: string;
    tickets_balance?: number;
    points?: number;
  }): Promise<ApiResponse> {
    try {
      console.log('Updating user:', id, userData);
      
      const backendData = {
        name: userData.name,
        email: userData.email,
        nik: userData.nik,
        phone: userData.phone,
        address: userData.address,
        status: userData.status,
        tickets_balance: userData.tickets_balance,
        ticketsBalance: userData.tickets_balance,
        points: userData.points
      };

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(backendData)
      });
      
      const result = await handleResponse(response);
      console.log('User updated:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: number): Promise<ApiResponse> {
    try {
      console.log('Deleting user:', id);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      
      const result = await handleResponse(response);
      console.log('User deleted:', result);
      
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

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

export const announcementsAPI = {
  async getAllAnnouncements(isActive?: boolean): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await fetch(`${API_BASE_URL}/announcements?${params}`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async getAnnouncementById(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async createAnnouncement(data: {
    title: string;
    content: string;
    type?: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async updateAnnouncement(id: number, data: {
    title?: string;
    content?: string;
    type?: string;
    isActive?: boolean;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteAnnouncement(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    return handleResponse(response);
  }
};

export const locationsAPI = {
  async getAllLocations(filters?: { 
    type?: string; 
    status?: string; 
    search?: string 
  }): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      console.log('Fetching locations from:', `${API_BASE_URL}/locations?${params}`);
      
      const response = await fetch(`${API_BASE_URL}/locations?${params}`, {
        headers: createHeaders()
      });
      
      const result = await handleResponse(response);
      console.log('Locations fetched:', result);
      
      return result;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return {
        success: false,
        locations: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async getLocationById(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        headers: createHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching location by ID:', error);
      throw error;
    }
  },

  async createLocation(locationData: {
    name: string;
    type: 'terminal' | 'koridor' | 'stand';
    address: string;
    coordinates?: string;
    description?: string;
    capacity?: number;
    operating_hours?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(locationData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  },

  async updateLocation(id: number, locationData: {
    name?: string;
    type?: 'terminal' | 'koridor' | 'stand';
    address?: string;
    coordinates?: string;
    description?: string;
    capacity?: number;
    status?: 'active' | 'inactive' | 'maintenance';
    operating_hours?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(locationData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  async deleteLocation(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  },

  async getActiveLocations(): Promise<ApiResponse> {
    return this.getAllLocations({ status: 'active' });
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const updateLocalUser = (userData: Partial<User>): void => {
  const currentUser = localStorage.getItem('user');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser) as User;
      const updatedUser = normalizeUserData({ ...user, ...userData });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating local user:', error);
    }
  }
};

export const retryRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (i < maxRetries) {
        console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; 
      }
    }
  }
  
  throw lastError;
};

export const debugAPI = async (): Promise<void> => {
  console.log('Debugging API connectivity...');
  
  try {
    const healthCheck = await checkBackendHealth();
    console.log('Backend health:', healthCheck ? 'Online' : 'Offline');
    
    const token = getAuthToken();
    console.log('Auth token:', token ? 'Present' : 'Missing');
    
    if (token) {
      const profileResponse = await authAPI.getProfile();
      console.log('Profile check:', profileResponse.user ? 'Valid' : 'Invalid');
    }
  } catch (error) {
    console.error('API Debug Error:', error);
  }
};