import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ticketKeys,
  fetchTickets,
  fetchTicket,
  createTicket,
  updateTicketStatus,
  respondToTicket,
} from '../api/tickets';
import { Ticket } from '../types';

export function useTickets(params: { status: string; priority: string; search: string }) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => fetchTickets(params),
  });
}

export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ticketKeys.detail(id ?? ''),
    queryFn: () => fetchTicket(id!),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string; priority: string }) =>
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

export function useRespondToTicket(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => respondToTicket(id!, message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id!) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
