import type { TicketStatus, TicketPriority } from '../constants/enums';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/ticketOptions';

export function getStatusLabel(status: string | TicketStatus): string {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label ?? String(status);
}

const STATUS_SHORT_LABELS: Record<string, string> = {
  open: 'باز',
  in_progress: 'بررسی',
  closed: 'بسته',
};

export function getStatusShortLabel(status: string | TicketStatus): string {
  return STATUS_SHORT_LABELS[status] ?? getStatusLabel(status);
}

export function getPriorityLabel(priority: string | TicketPriority): string {
  return PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? String(priority);
}
