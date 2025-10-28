const API_BASE = 'https://functions.poehali.dev';

const ENDPOINTS = {
  auth: '4fc9e859-8204-4a89-a644-13ff2262147a',
  bookings: 'f02eae3d-b70d-4e88-af2c-6429ae1b0a03',
  reviews: 'f7d21145-37df-4392-95cc-4cc3b5e4f72d',
  feedback: '5b65bea3-349f-4793-ace0-eb564074ed31',
};

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'client' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  session_token?: string;
  user_id?: number;
  user?: User;
  error?: string;
}

export interface Booking {
  id: number;
  client_name: string;
  phone: string;
  service: string;
  master: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

export interface Feedback {
  id: number;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

class ApiClient {
  private getSessionToken(): string | null {
    return localStorage.getItem('session_token');
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    const url = `${API_BASE}/${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const sessionToken = this.getSessionToken();
    if (sessionToken) {
      headers['X-Session-Token'] = sessionToken;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok && requiresAuth && response.status === 401) {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    return data;
  }

  async register(email: string, password: string, full_name: string, phone: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(ENDPOINTS.auth, 'POST', {
      action: 'register',
      email,
      password,
      full_name,
      phone,
    });

    if (response.session_token) {
      localStorage.setItem('session_token', response.session_token);
    }

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(ENDPOINTS.auth, 'POST', {
      action: 'login',
      email,
      password,
    });

    if (response.session_token && response.user) {
      localStorage.setItem('session_token', response.session_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request(ENDPOINTS.auth, 'POST', { action: 'logout' });
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<{ user: User } | { error: string }> {
    return this.request<{ user: User } | { error: string }>(ENDPOINTS.auth, 'GET', undefined, true);
  }

  async createBooking(data: {
    client_name: string;
    phone: string;
    service: string;
    master: string;
    booking_date: string;
    booking_time: string;
  }): Promise<{ success: boolean; booking_id?: number }> {
    return this.request(ENDPOINTS.bookings, 'POST', data);
  }

  async getBookings(): Promise<{ bookings: Booking[] }> {
    return this.request<{ bookings: Booking[] }>(ENDPOINTS.bookings, 'GET', undefined, true);
  }

  async updateBooking(id: number, status: string): Promise<{ success: boolean }> {
    return this.request(ENDPOINTS.bookings, 'PUT', { id, status }, true);
  }

  async getReviews(): Promise<{ reviews: Review[] }> {
    return this.request<{ reviews: Review[] }>(ENDPOINTS.reviews, 'GET');
  }

  async createReview(data: {
    author: string;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; review_id?: number }> {
    return this.request(ENDPOINTS.reviews, 'POST', data, true);
  }

  async approveReview(id: number, approved: boolean): Promise<{ success: boolean }> {
    return this.request(ENDPOINTS.reviews, 'PUT', { id, approved }, true);
  }

  async createFeedback(data: {
    name: string;
    phone: string;
    message: string;
  }): Promise<{ success: boolean; feedback_id?: number }> {
    return this.request(ENDPOINTS.feedback, 'POST', data);
  }

  async getFeedback(): Promise<{ feedback: Feedback[] }> {
    return this.request<{ feedback: Feedback[] }>(ENDPOINTS.feedback, 'GET', undefined, true);
  }

  async markFeedbackAsRead(id: number, is_read: boolean): Promise<{ success: boolean }> {
    return this.request(ENDPOINTS.feedback, 'PUT', { id, is_read }, true);
  }
}

export const api = new ApiClient();
