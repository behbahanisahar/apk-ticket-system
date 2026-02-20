import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Pencil, X, MessageCircle, Shield } from 'lucide-react';
import { Button, Input, Select, BackLink } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../types';
import { formatDateShort, formatDateTime } from '../lib/dateUtils';
import { CopyableTicketNumber } from '../components/tickets/CopyableTicketNumber';
import { toPersianDigits, getImageUrl } from '../lib/utils';
import { toast } from '../lib/toast';
import { useTicket, useRespondToTicket, useDeleteTicket, useUpdateTicketStatus, useUpdateTicket } from '../hooks/useTickets';
import { useQueryErrorToast } from '../hooks/useQueryErrorToast';
import { useConfirm } from '../hooks/useConfirm';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_COLOR_CLASS,
  STATUS_BORDER_CLASS,
  PRIORITY_DOT_CLASS,
  getStatusLabel,
  getPriorityLabel,
  TicketStatus,
  TicketPriority,
} from '../constants/tickets';
import { TEXT, BORDER, BG, FEEDBACK } from '../theme';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<TicketPriority>(TicketPriority.Medium);

  const { data: ticket, isLoading, error, isError } = useTicket(id);
  const respondMutation = useRespondToTicket(id);
  const deleteMutation = useDeleteTicket();
  const updateStatusMutation = useUpdateTicketStatus();
  const updateTicketMutation = useUpdateTicket(id);

  useQueryErrorToast(isError, error);

  const deleteConfirm = useConfirm<number>((ticketId) => {
    deleteMutation.mutate(ticketId, {
      onSuccess: () => {
        toast.success('تیکت حذف شد');
        navigate('/tickets');
      },
      onError: (e) => toast.error(e),
    });
  });

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex justify-end">
          <BackLink to="/tickets" variant="minimal" />
        </div>
      </div>
    );
  }

  if (isLoading || !ticket) return null;

  const canRespond = ticket.status !== TicketStatus.Closed && (ticket.user?.id === user?.id || user?.is_staff);
  const canEdit = ticket.user?.id === user?.id && ticket.status === TicketStatus.Open;
  const canDelete = canEdit;
  const canChangeStatus = user?.is_staff ?? false;

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
    <div className={`min-h-screen ${BG.page}`}>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex justify-end">
          <BackLink to="/tickets" />
        </div>

        <div
          className={`mb-8 rounded-2xl border ${BORDER.default} ${BG.surface} p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40 ${STATUS_BORDER_CLASS[ticket.status] ?? ''} border-s-4`}
        >
          <div className={`mb-5 flex flex-wrap items-center gap-2 rounded-xl ${BG.muted} px-4 py-3`}>
            {ticket.ticket_number && (
              <CopyableTicketNumber ticketNumber={ticket.ticket_number} size="xs" />
            )}
            {canChangeStatus ? (
              <div className="min-w-[140px]">
                <Select
                  label=""
                  options={STATUS_OPTIONS}
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
              <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ${STATUS_COLOR_CLASS[ticket.status] ?? BG.fallbackBadge}`}>
                {getStatusLabel(ticket.status)}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 rounded-lg border ${BORDER.default} bg-white/80 px-2.5 py-1 text-xs font-medium ${TEXT.muted}`}>
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${(PRIORITY_DOT_CLASS as Record<string, string>)[ticket.priority] ?? 'bg-slate-400'}`}
                aria-hidden
              />
              {getPriorityLabel(ticket.priority)}
            </span>
            <span className={`text-xs ${TEXT.subtle}`} title={formatDateTime(ticket.created_at)}>
              ایجاد: {formatDateShort(ticket.created_at)}
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
                  options={PRIORITY_OPTIONS}
                  value={editPriority}
                  onChange={(e: { target: { value: string } }) => setEditPriority(e.target.value as TicketPriority)}
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
                <h1 className={`text-2xl font-bold tracking-tight ${TEXT.heading}`}>{ticket.title}</h1>
                {canEdit && (
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {deleteConfirm.confirming ? (
                      <>
                        <span className={`flex items-center text-sm ${TEXT.muted}`}>آیا از حذف اطمینان دارید؟</span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteConfirm.confirm()}
                          disabled={deleteMutation.isPending}
                        >
                          بله، حذف
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={deleteConfirm.cancel}>
                          انصراف
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="button" variant="outline" size="sm" onClick={startEdit}>
                          <Pencil className="h-4 w-4" />
                          ویرایش
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteConfirm.show(ticket.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {!isEditing && (
            <p className={`mt-5 whitespace-pre-wrap rounded-xl ${BG.muted} p-5 ${TEXT.label} leading-[1.6]`}>
              {ticket.description}
            </p>
          )}
          {ticket.images && ticket.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {ticket.images.map((img) => {
                const url = getImageUrl(img.image);
                return url ? (
                  <div key={img.id} className="h-24 w-24 shrink-0">
                    <img
                      src={url}
                      alt="تصویر ضمیمه"
                      className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="mb-5 flex items-center gap-2">
          <MessageCircle className={`h-5 w-5 ${TEXT.subtle}`} />
          <h2 className={`text-lg font-bold ${TEXT.heading}`}>
            پاسخ‌ها {ticket.responses?.length ? `(${toPersianDigits(ticket.responses.length)})` : ''}
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
                    isAdmin ? 'bg-primary text-white ring-2 ring-primary/30' : BG.avatar
                  }`}
                >
                  {(getDisplayName(r.user) || '?').charAt(0).toUpperCase()}
                </div>
                <div
                  className={`min-w-0 max-w-[85%] rounded-2xl px-5 py-4 shadow-md ${
                    isAdmin
                      ? 'bg-primary/10 border border-primary/20 text-slate-800'
                      : `bg-white border ${BORDER.default} text-slate-800`
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${TEXT.heading}`}>{getDisplayName(r.user)}</span>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-primary/20 px-1.5 py-0.5 text-xs font-semibold text-primary">
                          <Shield className="h-3 w-3" />
                          ادمین
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${TEXT.subtle}`}>{formatDateTime(r.created_at)}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-[1.6]">{r.message}</p>
                </div>
              </div>
            );
          })}
          {(!ticket.responses || ticket.responses.length === 0) && (
            <div className={`rounded-2xl border-2 border-dashed ${BORDER.dashed} bg-slate-50/60 py-16 text-center`}>
              <MessageCircle className={`mx-auto mb-3 h-12 w-12 ${BG.emptyIcon}`} />
              <p className={`text-sm ${TEXT.subtle}`}>هنوز پاسخی ثبت نشده</p>
            </div>
          )}
        </div>

        {canRespond && (
          <form
            onSubmit={onRespond}
            className={`rounded-2xl border ${BORDER.default} ${BG.surface} p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40`}
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
            {messageError && <p className={`mt-2 text-sm ${FEEDBACK.error}`}>{messageError}</p>}
            <Button type="submit" className="mt-5" disabled={respondMutation.isPending}>
              {respondMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
