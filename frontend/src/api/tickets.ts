import api from './client';
import { Ticket, PaginatedResponse } from '../types';

const DEFAULT_LIMIT = 20;

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: { status?: string; priority?: string; search?: string; limit?: number; offset?: number }) =>
    [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
};

export interface TicketsPage {
  tickets: Ticket[];
  count: number;
  next: string | null;
  previous: string | null;
}

export async function fetchTickets(params: {
  status?: string;
  priority?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<TicketsPage> {
  const q: Record<string, string | number> = {};
  if (params.status && params.status !== 'all') q.status = params.status;
  if (params.priority && params.priority !== 'all') q.priority = params.priority;
  if (params.search) q.search = params.search;
  q.limit = params.limit ?? DEFAULT_LIMIT;
  q.offset = params.offset ?? 0;
  const { data } = await api.get<PaginatedResponse<Ticket[]>>('/tickets/', { params: q });
  return {
    tickets: data?.results || [],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
}

export async function fetchTicket(id: string): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}/`);
  return data;
}

export async function createTicket(payload: {
  title: string;
  description: string;
  priority: string;
}): Promise<Ticket> {
  const { data } = await api.post<Ticket>('/tickets/', payload);
  return data;
}

export async function updateTicketStatus(id: number, status: string): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}/`, { status });
  return data;
}

export async function respondToTicket(id: string, message: string): Promise<Ticket> {
  await api.post(`/tickets/${id}/respond/`, { message });
  return fetchTicket(id);
}

export async function deleteTicket(id: number): Promise<void> {
  await api.delete(`/tickets/${id}/`);
}
