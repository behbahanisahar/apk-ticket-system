export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
}

export function getDisplayName(user: User | undefined | null): string {
  if (!user) return '';
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return full || user.username;
}

export interface TicketResponse {
  id: number;
  ticket: number;
  user: User;
  message: string;
  created_at: string;
}

import type { TicketStatus, TicketPriority } from '../constants/enums';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
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
