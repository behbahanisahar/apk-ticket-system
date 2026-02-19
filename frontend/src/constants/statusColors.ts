import { TicketStatus } from './enums';

export const STATUS_COLORS: Record<
  TicketStatus,
  { badge: string; border: string }
> = {
  [TicketStatus.Open]: {
    badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200/60',
    border: 'border-s-emerald-400',
  },
  [TicketStatus.InProgress]: {
    badge: 'bg-amber-100 text-amber-800 ring-amber-200/60',
    border: 'border-s-amber-400',
  },
  [TicketStatus.Closed]: {
    badge: 'bg-slate-100 text-slate-600 ring-slate-200/60',
    border: 'border-s-slate-400',
  },
};
