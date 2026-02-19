import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, BackLink } from '../components/ui';
import { useCreateTicket } from '../hooks/useTickets';
import { useFormValidation } from '../hooks/useFormValidation';
import { PRIORITY_OPTIONS, TicketPriority } from '../constants/tickets';
import { TEXT, FEEDBACK, BORDER, BG } from '../theme';
import { toast } from '../lib/toast';

type CreateTicketErrors = { title?: string; description?: string };

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(TicketPriority.Medium);
  const { errors, validateAndSet, clearField } = useFormValidation<CreateTicketErrors>({});
  const navigate = useNavigate();
  const createMutation = useCreateTicket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAndSet(() => {
      const err: CreateTicketErrors = {};
      if (!title.trim()) err.title = 'عنوان الزامی است';
      else if (title.trim().length < 3) err.title = 'عنوان حداقل ۳ کاراکتر باشد';
      if (!description.trim()) err.description = 'توضیحات الزامی است';
      else if (description.trim().length < 10) err.description = 'توضیحات حداقل ۱۰ کاراکتر باشد';
      return err;
    });
    if (!isValid) return;
    try {
      await createMutation.mutateAsync({ title, description, priority });
      navigate('/tickets');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className={`min-h-screen ${BG.page}`}>
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex justify-end">
          <BackLink to="/tickets" />
        </div>
        <div className={`rounded-2xl border ${BORDER.default} ${BG.surface} p-8 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40`}>
          <h2 className={`mb-2 text-2xl font-bold tracking-tight ${TEXT.heading}`}>تیکت جدید</h2>
          <p className={`mb-8 ${TEXT.muted}`}>درخواست خود را با جزئیات ثبت کنید</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                label="عنوان"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value);
                  clearField('title');
                }}
              />
              {errors.title && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.title}</p>}
            </div>
            <div className="mb-6">
              <Input
                label="توضیحات"
                multiline
                rows={4}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setDescription(e.target.value);
                  clearField('description');
                }}
              />
              {errors.description && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.description}</p>}
            </div>
            <div className="mb-6">
              <Select
                label="اولویت"
                options={PRIORITY_OPTIONS}
                value={priority}
                onChange={(e: { target: { value: string } }) => setPriority(e.target.value as TicketPriority)}
              />
            </div>
            <Button type="submit" size="lg" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'در حال ایجاد...' : 'ایجاد تیکت'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
