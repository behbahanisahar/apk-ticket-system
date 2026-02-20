import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import api from '../api/client';
import { useFormValidation } from '../hooks/useFormValidation';
import { TEXT, FEEDBACK } from '../theme';
import { toast } from '../lib/toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterErrors = Partial<Record<'username' | 'password' | 'email' | 'first_name' | 'last_name', string>>;

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { errors, validateAndSet, clearField } = useFormValidation<RegisterErrors>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAndSet(() => {
      const err: RegisterErrors = {};
      if (!firstName.trim()) err.first_name = 'نام الزامی است';
      if (!lastName.trim()) err.last_name = 'نام خانوادگی الزامی است';
      if (!username.trim()) err.username = 'نام کاربری الزامی است';
      else if (username.trim().length < 3) err.username = 'نام کاربری حداقل ۳ کاراکتر باشد';
      if (!password) err.password = 'رمز عبور الزامی است';
      else if (password.length < 8) err.password = 'رمز عبور حداقل ۸ کاراکتر باشد';
      if (!email.trim()) err.email = 'ایمیل الزامی است';
      else if (!EMAIL_RE.test(email)) err.email = 'ایمیل معتبر نیست';
      return err;
    });
    if (!isValid) return;
    setLoading(true);
    try {
      await api.post('/auth/register/', {
        username,
        password,
        email,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      navigate('/login');
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className={`mb-2 text-center text-2xl font-bold ${TEXT.heading}`}>ثبت‌نام در سیستم تیکت</h2>
      <p className={`mb-8 text-center text-sm ${TEXT.muted}`}>حساب جدید بسازید</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <Input
            label="نام"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFirstName(e.target.value);
              clearField('first_name');
            }}
          />
          {errors.first_name && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.first_name}</p>}
        </div>
        <div className="mb-4">
          <Input
            label="نام خانوادگی"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLastName(e.target.value);
              clearField('last_name');
            }}
          />
          {errors.last_name && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.last_name}</p>}
        </div>
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
        <div className="mb-4">
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              clearField('email');
            }}
          />
          {errors.email && <p className={`mt-1 text-sm ${FEEDBACK.error}`}>{errors.email}</p>}
        </div>
        <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
          ثبت‌نام
        </Button>
      </form>
      <p className={`mt-8 text-center text-sm ${TEXT.muted}`}>
        قبلاً ثبت‌نام کرده‌اید؟{' '}
        <Link to="/login" className="font-semibold text-primary transition-colors hover:underline">ورود</Link>
      </p>
    </AuthLayout>
  );
}
