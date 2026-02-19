import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions } from '../ui';
import { Ticket } from '../../types';

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
  open: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-amber-100 text-amber-800',
  closed: 'bg-slate-100 text-slate-600',
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
    <Link to={`/ticket/${ticket.id}`} className="block text-inherit no-underline">
      <Card className="h-full group cursor-pointer">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">{ticket.title}</h3>
            <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR_CLASS[ticket.status] || 'bg-slate-100'}`}>
              {statusLabel(ticket.status)}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{ticket.description?.slice(0, 120)}...</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600">{priorityLabel(ticket.priority)}</span>
          </div>
        </CardContent>
        <CardActions className="border-t border-slate-100/80 px-4 py-3">
          <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary-dark">مشاهده</span>
        </CardActions>
      </Card>
    </Link>
  );
}
