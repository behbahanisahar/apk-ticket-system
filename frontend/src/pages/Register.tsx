import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import api from '../api/client';
import { AxiosError } from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await api.post('/auth/register/', { username, password, email });
      navigate('/login');
    } catch (e) {
      const res = e as AxiosError<{ detail?: string; username?: string[] }>;
      const msg = res.response?.data?.detail || res.response?.data?.username?.[0] || 'خطا در ثبت‌نام';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">ثبت‌نام در سیستم تیکت</h2>
      <p className="mb-8 text-center text-sm text-slate-600">حساب جدید بسازید</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input label="نام کاربری" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-4">
          <Input label="رمز عبور" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <Input label="ایمیل" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
        </div>
        {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
        <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2 bg-[#ED1E23] hover:bg-[#c4181c]">
          ثبت‌نام
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        قبلاً ثبت‌نام کرده‌اید؟{' '}
        <Link to="/login" className="font-semibold text-[#ED1E23] transition-colors hover:underline">ورود</Link>
      </p>
    </AuthLayout>
  );
}
