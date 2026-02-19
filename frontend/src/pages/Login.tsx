import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { toast } from '../lib/toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('auth_expired')) {
      sessionStorage.removeItem('auth_expired');
      toast.error('نشست شما منقضی شده. لطفاً مجدداً وارد شوید.');
    }
  }, []);

  const validate = (): boolean => {
    const e: { username?: string; password?: string } = {};
    if (!username.trim()) e.username = 'نام کاربری الزامی است';
    if (!password) e.password = 'رمز عبور الزامی است';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(username, password);
      navigate('/tickets');
    } catch (e) {
      toast.error(e);
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
