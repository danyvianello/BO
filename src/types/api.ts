export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ErrorResponse {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'operator' | 'user';
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface Operator {
    _id?: string;
    id?: string;
    name: string;
    code: string;
    email: string;
    status: 'active' | 'inactive';
    commission: number;
    maxBet: number;
    minBet: number;
    api_key?: string;
    default_currency?: string;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
    status: 'active' | 'inactive';
    exchangeRate: number;
    decimals: number;
    createdAt: string;
    updatedAt: string;
}

export interface Game {
    _id?: string;
    id?: string;
    name: string;
    provider: string;
    type: 'slot' | 'table' | 'live' | 'lottery';
    status: 'active' | 'inactive';
    description?: string;
    thumbnail_url?: string;
    rtp?: number;
    min_bet?: number;
    max_bet?: number;
    currency?: string;
    is_active?: boolean;
    config?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Provider {
    id: string;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    apiKey: string;
    apiSecret: string;
    createdAt: string;
    updatedAt: string;
}

export interface Session {
    id: string;
    userId: string;
    gameId: string;
    operatorId: string;
    currency: string;
    betAmount: number;
    winAmount: number;
    status: 'active' | 'completed' | 'cancelled';
    startTime: string;
    endTime?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    sessionId: string;
    type: 'bet' | 'win' | 'refund';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
}

export interface Report {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'completed' | 'failed';
    url?: string;
    createdAt: string;
    updatedAt: string;
} 