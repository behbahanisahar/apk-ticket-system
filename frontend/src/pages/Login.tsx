import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { TEXT, FEEDBACK } from '../theme';
import { toast } from '../lib/toast';

type LoginErrors = { username?: string; password?: string };

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { errors, validateAndSet, clearField } = useFormValidation<LoginErrors>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ورود | سیستم تیکت | APK';
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem('auth_expired')) {
      sessionStorage.removeItem('auth_expired');
      toast.error('نشست شما منقضی شده. لطفاً مجدداً وارد شوید.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAndSet(() => {
      const e: LoginErrors = {};
      if (!username.trim()) e.username = 'نام کاربری الزامی است';
      if (!password) e.password = 'رمز عبور الزامی است';
      return e;
    });
    if (!isValid) return;
    setLoading(true);
    try {
      await login(username, password);
      navigate('/tickets');
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className={`mb-2 text-center text-2xl font-bold ${TEXT.heading}`}>ورود به سیستم تیکت</h2>
      <p className={`mb-8 text-center text-sm ${TEXT.muted}`}>به حساب خود وارد شوید</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="نام کاربری"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              clearField('username');
            }}
          />
          {errors.username && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.username}</p>}
        </div>
        <div className="mb-4">
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              clearField('password');
            }}
          />
          {errors.password && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.password}</p>}
        </div>
        <Button type="submit" fullWidth size="lg" disabled={loading} aria-busy={loading} className="mt-2">
          {loading ? 'در حال ورود...' : 'ورود'}
        </Button>
      </form>
      <p className={`mt-8 text-center text-sm ${TEXT.muted}`}>
        حساب کاربری ندارید؟{' '}
        <Link to="/register" className="font-semibold text-primary transition-colors hover:underline">ثبت‌نام</Link>
      </p>
    </AuthLayout>
  );
}
