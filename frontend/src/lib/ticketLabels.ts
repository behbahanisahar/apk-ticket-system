import type { TicketStatus, TicketPriority } from '../constants/enums';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/ticketOptions';

export function getStatusLabel(status: string | TicketStatus): string {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label ?? String(status);
}

export function getPriorityLabel(priority: string | TicketPriority): string {
  return PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? String(priority);
}
