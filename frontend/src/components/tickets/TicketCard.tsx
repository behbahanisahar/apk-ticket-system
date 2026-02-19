import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions } from '../ui';
import { Ticket } from '../../types';
import { formatDateShort } from '../../lib/dateUtils';
import { Calendar } from 'lucide-react';
import { STATUS_BORDER_CLASS, STATUS_COLOR_CLASS, getStatusLabel, getPriorityLabel } from '../../constants/tickets';
import { TEXT, BORDER, BG } from '../../theme';

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
            <h3 className={`min-w-0 flex-1 text-base font-bold ${TEXT.heading} line-clamp-2 group-hover:text-primary transition-colors`}>
              {ticket.title}
            </h3>
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${STATUS_COLOR_CLASS[ticket.status] || BG.fallbackBadge}`}
            >
              {getStatusLabel(ticket.status)}
            </span>
          </div>
          <p className="mt-2 flex-1 line-clamp-2 text-sm text-slate-600 leading-snug">
            {ticket.description?.slice(0, 100)}
            {ticket.description && ticket.description.length > 100 ? '...' : ''}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className={`rounded-md border ${BORDER.default} px-2 py-0.5 text-xs font-medium ${TEXT.muted}`}>
              {getPriorityLabel(ticket.priority)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {formatDateShort(ticket.created_at)}
            </span>
          </div>
        </CardContent>
        <CardActions className={`shrink-0 border-t ${BORDER.divider} ${BG.empty} px-4 py-2.5`}>
          <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary-dark">
            مشاهده
          </span>
        </CardActions>
      </Card>
    </Link>
  );
}
