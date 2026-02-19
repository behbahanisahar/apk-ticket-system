import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Ticket } from '../types';

const statusLabel: Record<string, string> = { open: 'باز', in_progress: 'در حال بررسی', closed: 'بسته' };
const statusColorClass: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-amber-100 text-amber-800',
  closed: 'bg-slate-100 text-slate-600',
};
const priorityLabel: Record<string, string> = { low: 'کم', medium: 'متوسط', high: 'زیاد' };

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<Ticket>(`/tickets/${id}/`)
      .then((r) => setTicket(r.data))
      .catch(() => navigate('/tickets'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const onRespond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id) return;
    api.post(`/tickets/${id}/respond/`, { message }).then(() => {
      setMessage('');
      api.get<Ticket>(`/tickets/${id}/`).then((r) => setTicket(r.data));
    });
  };

  if (loading || !ticket) return null;

  const canRespond = ticket.status !== 'closed' && (ticket.user?.id === user?.id || user?.is_staff);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to="/tickets"
        className="mb-6 inline-flex items-center gap-1 text-slate-600 no-underline hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">بازگشت</span>
      </Link>
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card ring-1 ring-slate-200/40">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColorClass[ticket.status] || 'bg-slate-100'}`}>
            {statusLabel[ticket.status]}
          </span>
          <span className="rounded-lg border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600">
            {priorityLabel[ticket.priority]}
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">{ticket.title}</h1>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-600">{ticket.description}</p>
      </div>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">پاسخ‌ها</h3>
      <div className="flex flex-col gap-4">
        {ticket.responses?.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {r.user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.user?.username}</p>
                <p className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString('fa-IR')}</p>
                <p className="mt-2 text-sm">{r.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {canRespond && (
        <form onSubmit={onRespond} className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card ring-1 ring-slate-200/40">
          <Input
            label="پاسخ"
            multiline
            rows={3}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" className="mt-4">ارسال پاسخ</Button>
        </form>
      )}
    </div>
  );
}
