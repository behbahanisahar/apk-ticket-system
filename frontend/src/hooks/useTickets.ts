import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ticketKeys,
  fetchTickets,
  fetchTicket,
  createTicket,
  updateTicketStatus,
  updateTicket,
  respondToTicket,
  deleteTicket,
} from '../api/tickets';
import { Ticket } from '../types';

export function useTickets(params: {
  status: string;
  priority: string;
  search: string;
  limit?: number;
  offset?: number;
  ordering?: string;
}) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => fetchTickets(params),
    refetchInterval: 5000,
  });
}

export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ticketKeys.detail(id ?? ''),
    queryFn: () => fetchTicket(id!),
    enabled: !!id,
    refetchInterval: 5000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string; priority: string; images?: File[] }) =>
      createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateTicketStatus(id, status),
    onSuccess: (data: Ticket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(String(data.id)) });
    },
  });
}

export function useUpdateTicket(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title?: string; description?: string; priority?: string }) =>
      updateTicket(Number(id!), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id!) });
    },
  });
}

export function useRespondToTicket(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => respondToTicket(id!, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id!) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
      queryClient.removeQueries({ queryKey: ticketKeys.detail(String(id)) });
    },
  });
}
