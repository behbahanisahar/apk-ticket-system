import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/tickets');
    } catch (e) {
      const res = e as AxiosError<{ detail?: string; non_field_errors?: string[] }>;
      const msg = res.response?.data?.detail || res.response?.data?.non_field_errors?.[0] || 'خطا در ورود';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">ورود به سیستم تیکت</h2>
      <p className="mb-8 text-center text-sm text-slate-600">به حساب خود وارد شوید</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input label="نام کاربری" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-4">
          <Input label="رمز عبور" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
        </div>
        {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
        <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2 bg-[#ED1E23] hover:bg-[#c4181c]">
          ورود
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        حساب کاربری ندارید؟{' '}
        <Link to="/register" className="font-semibold text-[#ED1E23] transition-colors hover:underline">ثبت‌نام</Link>
      </p>
    </AuthLayout>
  );
}
