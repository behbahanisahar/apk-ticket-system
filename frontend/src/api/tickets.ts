import api from './client';
import { Ticket, PaginatedResponse } from '../types';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: { status?: string; priority?: string; search?: string }) =>
    [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
};

export async function fetchTickets(params: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<Ticket[]> {
  const q: Record<string, string> = {};
  if (params.status && params.status !== 'all') q.status = params.status;
  if (params.priority && params.priority !== 'all') q.priority = params.priority;
  if (params.search) q.search = params.search;
  const { data } = await api.get<PaginatedResponse<Ticket[]> | Ticket[]>('/tickets/', {
    params: Object.keys(q).length ? q : undefined,
  });
  return Array.isArray(data) ? data : (data?.results || []);
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
