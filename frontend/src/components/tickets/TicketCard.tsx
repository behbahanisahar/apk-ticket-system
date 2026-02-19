import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions } from '../ui';
import { Ticket } from '../../types';
import { formatDateShort } from '../../lib/dateUtils';
import { Calendar } from 'lucide-react';

const STATUS_OPTS = [
  { value: 'open', label: 'باز' },
  { value: 'in_progress', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته' },
];
const PRIORITY_OPTS = [
  { value: 'low', label: 'کم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'زیاد' },
];

const STATUS_COLOR_CLASS: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800 ring-emerald-200/60',
  in_progress: 'bg-amber-100 text-amber-800 ring-amber-200/60',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200/60',
};
const STATUS_BORDER_CLASS: Record<string, string> = {
  open: 'border-s-emerald-400',
  in_progress: 'border-s-amber-400',
  closed: 'border-s-slate-400',
};

function statusLabel(s: string) {
  return STATUS_OPTS.find((o) => o.value === s)?.label || s;
}
function priorityLabel(p: string) {
  return PRIORITY_OPTS.find((o) => o.value === p)?.label || p;
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link to={`/ticket/${ticket.id}`} className="block h-full text-inherit no-underline">
      <Card
        className={`flex h-full min-h-0 cursor-pointer flex-col transition-all hover:shadow-lg hover:-translate-y-0.5 group overflow-hidden ${STATUS_BORDER_CLASS[ticket.status] || ''} border-s-4`}
      >
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-base font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
              {ticket.title}
            </h3>
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${STATUS_COLOR_CLASS[ticket.status] || 'bg-slate-100'}`}
            >
              {statusLabel(ticket.status)}
            </span>
          </div>
          <p className="mt-2 flex-1 line-clamp-2 text-sm text-slate-600 leading-snug">
            {ticket.description?.slice(0, 100)}
            {ticket.description && ticket.description.length > 100 ? '...' : ''}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-md border border-slate-200/80 px-2 py-0.5 text-xs font-medium text-slate-600">
              {priorityLabel(ticket.priority)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {formatDateShort(ticket.created_at)}
            </span>
          </div>
        </CardContent>
        <CardActions className="shrink-0 border-t border-slate-100/80 bg-slate-50/50 px-4 py-2.5">
          <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary-dark">
            مشاهده
          </span>
        </CardActions>
      </Card>
    </Link>
  );
}
