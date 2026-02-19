export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface TicketResponse {
  id: number;
  ticket: number;
  user: User;
  message: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  user: User;
  responses?: TicketResponse[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T;
}
