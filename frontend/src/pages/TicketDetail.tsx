import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Pencil, X, MessageCircle, Shield } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../types';
import { formatDateTime } from '../lib/dateUtils';
import { toast } from '../lib/toast';
import { useTicket, useRespondToTicket, useDeleteTicket, useUpdateTicketStatus, useUpdateTicket } from '../hooks/useTickets';

const statusLabel: Record<string, string> = { open: 'باز', in_progress: 'در حال بررسی', closed: 'بسته' };
const statusColorClass: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800 ring-emerald-200/60',
  in_progress: 'bg-amber-100 text-amber-800 ring-amber-200/60',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200/60',
};
const statusBorderClass: Record<string, string> = {
  open: 'border-s-emerald-400',
  in_progress: 'border-s-amber-400',
  closed: 'border-s-slate-400',
};
const priorityLabel: Record<string, string> = { low: 'کم', medium: 'متوسط', high: 'زیاد' };
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

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');

  const { data: ticket, isLoading, error, isError } = useTicket(id);
  const respondMutation = useRespondToTicket(id);
  const deleteMutation = useDeleteTicket();
  const updateStatusMutation = useUpdateTicketStatus();
  const updateTicketMutation = useUpdateTicket(id);

  useEffect(() => {
    if (isError && error) toast.error(error);
  }, [isError, error]);

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex justify-end">
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 text-slate-600 no-underline hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">بازگشت</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !ticket) return null;

  const canRespond = ticket.status !== 'closed' && (ticket.user?.id === user?.id || user?.is_staff);
  const canEdit = ticket.user?.id === user?.id && ticket.status === 'open';
  const canDelete = canEdit;
  const canChangeStatus = user?.is_staff ?? false;

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

  const startEdit = () => {
    setEditTitle(ticket.title);
    setEditDescription(ticket.description);
    setEditPriority(ticket.priority);
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const onSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error('عنوان الزامی است');
      return;
    }
    updateTicketMutation.mutate(
      { title: editTitle.trim(), description: editDescription.trim(), priority: editPriority },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success('تیکت ویرایش شد');
        },
        onError: (err) => toast.error(err),
      }
    );
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex justify-end">
          <Link
            to="/tickets"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-600 no-underline shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">بازگشت</span>
          </Link>
        </div>

        {/* Ticket header card */}
        <div
          className={`mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40 ${statusBorderClass[ticket.status] || ''} border-s-4`}
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-600">#{ticket.id}</span>
            {canChangeStatus ? (
              <div className="min-w-[140px]">
                <Select
                  label="وضعیت"
                  options={STATUS_OPTS}
                  value={ticket.status}
                  onChange={(e: { target: { value: string } }) =>
                    updateStatusMutation.mutate(
                      { id: ticket.id, status: e.target.value },
                      { onError: (err) => toast.error(err) }
                    )
                  }
                  size="small"
                />
              </div>
            ) : (
              <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ${statusColorClass[ticket.status] || 'bg-slate-100'}`}>
                {statusLabel[ticket.status]}
              </span>
            )}
            <span className="rounded-lg border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600">
              {priorityLabel[ticket.priority]}
            </span>
            <span className="text-xs text-slate-500">
              ایجاد: {formatDateTime(ticket.created_at)}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            {isEditing ? (
              <form onSubmit={onSaveEdit} className="flex-1 space-y-4">
                <Input
                  label="عنوان"
                  value={editTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
                />
                <Input
                  label="توضیحات"
                  multiline
                  rows={4}
                  value={editDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditDescription(e.target.value)}
                />
                <Select
                  label="اولویت"
                  options={PRIORITY_OPTS}
                  value={editPriority}
                  onChange={(e: { target: { value: string } }) => setEditPriority(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={updateTicketMutation.isPending}>
                    ذخیره
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                    انصراف
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{ticket.title}</h1>
                {canEdit && (
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={startEdit}>
                      <Pencil className="h-4 w-4" />
                      ویرایش
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={onDelete}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          {!isEditing && (
            <p className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-50/80 p-5 text-slate-700 leading-[1.6]">
              {ticket.description}
            </p>
          )}
        </div>

        {/* Chat-style responses */}
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-900">
            پاسخ‌ها {ticket.responses?.length ? `(${ticket.responses.length})` : ''}
          </h2>
        </div>
        <div className="mb-8 flex flex-col gap-5">
          {ticket.responses?.map((r) => {
            const isAdmin = r.user?.is_staff ?? false;
            return (
              <div
                key={r.id}
                className={`flex gap-4 ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ${
                    isAdmin ? 'bg-primary text-white ring-2 ring-primary/30' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {(getDisplayName(r.user) || '?').charAt(0).toUpperCase()}
                </div>
                <div
                  className={`min-w-0 max-w-[85%] rounded-2xl px-5 py-4 shadow-md ${
                    isAdmin
                      ? 'bg-primary/10 border border-primary/20 text-slate-800'
                      : 'bg-white border border-slate-200/80 text-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{getDisplayName(r.user)}</span>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-primary/20 px-1.5 py-0.5 text-xs font-semibold text-primary">
                          <Shield className="h-3 w-3" />
                          ادمین
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{formatDateTime(r.created_at)}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-[1.6]">{r.message}</p>
                </div>
              </div>
            );
          })}
          {(!ticket.responses || ticket.responses.length === 0) && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-16 text-center">
              <MessageCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-sm text-slate-500">هنوز پاسخی ثبت نشده</p>
            </div>
          )}
        </div>

        {canRespond && (
          <form
            onSubmit={onRespond}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40"
          >
            <Input
              label="ارسال پاسخ"
              multiline
              rows={4}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setMessage(e.target.value);
                setMessageError('');
              }}
              placeholder="پاسخ خود را بنویسید..."
            />
            {messageError && <p className="mt-2 text-sm text-red-600">{messageError}</p>}
            <Button type="submit" className="mt-5" disabled={respondMutation.isPending}>
              {respondMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
