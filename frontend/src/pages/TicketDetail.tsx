import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../types';
import { toast } from '../lib/toast';
import { useTicket, useRespondToTicket, useDeleteTicket } from '../hooks/useTickets';

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
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');

  const { data: ticket, isLoading, error, isError } = useTicket(id);
  const respondMutation = useRespondToTicket(id);
  const deleteMutation = useDeleteTicket();

  useEffect(() => {
    if (isError && error) toast.error(error);
  }, [isError, error]);

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/tickets"
          className="mb-6 inline-flex items-center gap-1 text-slate-600 no-underline hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">بازگشت</span>
        </Link>
      </div>
    );
  }

  if (isLoading || !ticket) return null;

  const canRespond = ticket.status !== 'closed' && (ticket.user?.id === user?.id || user?.is_staff);
  const canDelete = ticket.user?.id === user?.id;

  const onDelete = () => {
    if (!confirm('آیا از حذف این تیکت اطمینان دارید؟')) return;
    deleteMutation.mutate(ticket.id, {
      onSuccess: () => {
        toast.success('تیکت حذف شد');
        navigate('/tickets');
      },
      onError: (e) => toast.error(e),
    });
  };

  const onRespond = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageError('');
    if (!message.trim()) {
      setMessageError('پاسخ الزامی است');
      return;
    }
    if (!id) return;
    respondMutation.mutate(message, {
      onSuccess: () => setMessage(''),
      onError: (err) => toast.error(err),
    });
  };

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
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={deleteMutation.isPending}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          )}
        </div>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-600">{ticket.description}</p>
      </div>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">پاسخ‌ها</h3>
      <div className="flex flex-col gap-4">
        {ticket.responses?.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {(getDisplayName(r.user) || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{getDisplayName(r.user)}</p>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setMessage(e.target.value);
              setMessageError('');
            }}
          />
          {messageError && <p className="mt-1 text-sm text-red-600">{messageError}</p>}
          <Button type="submit" className="mt-4" disabled={respondMutation.isPending}>
            {respondMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ'}
          </Button>
        </form>
      )}
    </div>
  );
}
