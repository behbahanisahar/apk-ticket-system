import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import api from '../api/client';
import { toast } from '../lib/toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const e: { username?: string; password?: string; email?: string } = {};
    if (!username.trim()) e.username = 'نام کاربری الزامی است';
    else if (username.trim().length < 3) e.username = 'نام کاربری حداقل ۳ کاراکتر باشد';
    if (!password) e.password = 'رمز عبور الزامی است';
    else if (password.length < 8) e.password = 'رمز عبور حداقل ۸ کاراکتر باشد';
    if (!email.trim()) e.email = 'ایمیل الزامی است';
    else if (!EMAIL_RE.test(email)) e.email = 'ایمیل معتبر نیست';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/register/', { username, password, email });
      navigate('/login');
    } catch (e) {
      toast.error(e);
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
          <Input
            label="نام کاربری"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              setFieldErrors((p) => ({ ...p, username: undefined }));
            }}
          />
          {fieldErrors.username && <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>}
        </div>
        <div className="mb-4">
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setFieldErrors((p) => ({ ...p, password: undefined }));
            }}
          />
          {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
        </div>
        <div className="mb-4">
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
          />
          {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
        </div>
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
