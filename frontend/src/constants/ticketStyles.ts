import { TicketStatus, TicketPriority } from './enums';
import { STATUS_COLORS } from './statusColors';

export const PRIORITY_DOT_CLASS: Record<TicketPriority, string> = {
  [TicketPriority.Low]: 'bg-emerald-500',
  [TicketPriority.Medium]: 'bg-amber-500',
  [TicketPriority.High]: 'bg-red-500',
};

export const STATUS_COLOR_CLASS: Record<TicketStatus, string> = {
  [TicketStatus.Open]: STATUS_COLORS[TicketStatus.Open].badge,
  [TicketStatus.InProgress]: STATUS_COLORS[TicketStatus.InProgress].badge,
  [TicketStatus.Closed]: STATUS_COLORS[TicketStatus.Closed].badge,
};

export const STATUS_BORDER_CLASS: Record<TicketStatus, string> = {
  [TicketStatus.Open]: STATUS_COLORS[TicketStatus.Open].border,
  [TicketStatus.InProgress]: STATUS_COLORS[TicketStatus.InProgress].border,
  [TicketStatus.Closed]: STATUS_COLORS[TicketStatus.Closed].border,
};
