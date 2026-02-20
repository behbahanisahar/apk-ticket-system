import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import Register from './Register';
import api from '../api/client';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useNavigate: () => mockNavigate };
});

describe('Register', () => {
  it('renders registration form', () => {
    render(<Register />);
    expect(screen.getByText('ثبت‌نام در سیستم تیکت')).toBeInTheDocument();
    expect(screen.getByLabelText('نام')).toBeInTheDocument();
    expect(screen.getByLabelText('نام خانوادگی')).toBeInTheDocument();
    expect(screen.getByLabelText('نام کاربری')).toBeInTheDocument();
    expect(screen.getByLabelText('رمز عبور')).toBeInTheDocument();
    expect(screen.getByLabelText('ایمیل')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<Register />);
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام' }));
    await waitFor(() => {
      expect(screen.getByText('نام الزامی است')).toBeInTheDocument();
      expect(screen.getByText('نام خانوادگی الزامی است')).toBeInTheDocument();
    });
  });

  it('shows validation error for short username', async () => {
    const user = userEvent.setup();
    render(<Register />);
    await user.type(screen.getByLabelText('نام'), 'ن');
    await user.type(screen.getByLabelText('نام خانوادگی'), 'ف');
    await user.type(screen.getByLabelText('نام کاربری'), 'ab');
    await user.type(screen.getByLabelText('رمز عبور'), 'password123');
    await user.type(screen.getByLabelText('ایمیل'), 'a@b.com');
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام' }));
    await waitFor(() => {
      expect(screen.getByText('نام کاربری حداقل ۳ کاراکتر باشد')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<Register />);
    await user.type(screen.getByLabelText('نام'), 'نام');
    await user.type(screen.getByLabelText('نام خانوادگی'), 'خانوادگی');
    await user.type(screen.getByLabelText('نام کاربری'), 'user123');
    await user.type(screen.getByLabelText('رمز عبور'), 'password123');
    await user.type(screen.getByLabelText('ایمیل'), 'notanemail');
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام' }));
    await waitFor(() => {
      expect(screen.getByText('ایمیل معتبر نیست')).toBeInTheDocument();
    });
  });

  it('navigates to login on successful registration', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const user = userEvent.setup();
    render(<Register />);
    await user.type(screen.getByLabelText('نام'), 'نام');
    await user.type(screen.getByLabelText('نام خانوادگی'), 'خانوادگی');
    await user.type(screen.getByLabelText('نام کاربری'), 'newuser');
    await user.type(screen.getByLabelText('رمز عبور'), 'password123');
    await user.type(screen.getByLabelText('ایمیل'), 'user@test.com');
    await user.click(screen.getByRole('button', { name: 'ثبت‌نام' }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
