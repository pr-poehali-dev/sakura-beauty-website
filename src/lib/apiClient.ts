const API_URL = 'https://functions.poehali.dev/6816f86a-23a7-4c1b-bf49-ddb0cac0dd85';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface Booking {
  id: number;
  user_id: number;
  employee_id: number;
  service_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  service_name?: string;
  price?: number;
  client_name?: string;
  employee_name?: string;
}

interface Review {
  id: number;
  client_id: number;
  booking_id?: number;
  rating: number;
  comment: string;
  status: string;
  client_name?: string;
  created_at: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  created_at: string;
}

class APIClient {
  async getServices(): Promise<{ services: Service[] }> {
    const response = await fetch(`${API_URL}?path=services&action=list`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  }

  async getServiceCategories(): Promise<{ categories: string[] }> {
    const response = await fetch(`${API_URL}?path=services&action=categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  async createService(data: Omit<Service, 'id'>): Promise<{ id: number; status: string }> {
    const response = await fetch(`${API_URL}?path=services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create service');
    return response.json();
  }

  async updateService(data: Service): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}?path=services`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update service');
    return response.json();
  }

  async getBookings(params?: { user_id?: number; employee_id?: number; status?: string }): Promise<{ bookings: Booking[] }> {
    const queryParams = new URLSearchParams({ path: 'bookings' });
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params?.employee_id) queryParams.append('employee_id', params.employee_id.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_URL}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  }

  async createBooking(data: Omit<Booking, 'id' | 'created_at'>): Promise<{ id: number; status: string }> {
    const response = await fetch(`${API_URL}?path=bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  }

  async updateBooking(id: number, data: Partial<Booking>): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}?path=bookings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  }

  async getReviews(status: string = 'approved'): Promise<{ reviews: Review[] }> {
    const response = await fetch(`${API_URL}?path=reviews&status=${status}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }

  async createReview(data: Omit<Review, 'id' | 'created_at'>): Promise<{ id: number; status: string }> {
    const response = await fetch(`${API_URL}?path=reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  }

  async updateReview(id: number, status: string): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}?path=reviews`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
  }

  async getUsers(params?: { role?: string; id?: number }): Promise<{ users?: User[]; user?: User }> {
    const queryParams = new URLSearchParams({ path: 'users' });
    if (params?.role) queryParams.append('role', params.role);
    if (params?.id) queryParams.append('id', params.id.toString());

    const response = await fetch(`${API_URL}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  async updateUser(data: User): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}?path=users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  }

  async getSchedule(employee_id?: number): Promise<{ schedule: any[] }> {
    const queryParams = new URLSearchParams({ path: 'schedule' });
    if (employee_id) queryParams.append('employee_id', employee_id.toString());

    const response = await fetch(`${API_URL}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return response.json();
  }

  async createSchedule(data: { employee_id: number; day_of_week: number; start_time: string; end_time: string }): Promise<{ id: number; status: string }> {
    const response = await fetch(`${API_URL}?path=schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create schedule');
    return response.json();
  }
}

export const apiClient = new APIClient();
export type { Service, Booking, Review, User };
