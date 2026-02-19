import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import api from '../api/client';
import { AxiosError } from 'axios';

const PRIORITIES = [
  { value: 'low', label: 'کم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'زیاد' },
];

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await api.post('/tickets/', { title, description, priority });
      navigate('/tickets');
    } catch (e) {
      const res = e as AxiosError<{ detail?: string }>;
      setErr(res.response?.data?.detail || 'خطا در ایجاد تیکت');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        to="/tickets"
        className="mb-6 inline-flex items-center gap-1.5 text-slate-600 no-underline transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">بازگشت</span>
      </Link>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft-lg ring-1 ring-slate-200/40">
        <h2 className="mb-2 text-xl font-bold text-slate-900">تیکت جدید</h2>
        <p className="mb-6 text-sm text-slate-600">درخواست خود را با جزئیات ثبت کنید</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input label="عنوان" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-6">
            <Input
              label="توضیحات"
              multiline
              rows={4}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Select
              label="اولویت"
              options={PRIORITIES}
              value={priority}
              onChange={(e: { target: { value: string } }) => setPriority(e.target.value)}
            />
          </div>
          {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
          <Button type="submit" size="lg" disabled={loading}>
            ایجاد تیکت
          </Button>
        </form>
      </div>
    </div>
  );
}
