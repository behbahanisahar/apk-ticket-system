import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import Login from './Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useNavigate: () => mockNavigate };
});

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    sessionStorage.clear();
  });

  it('renders login form with username and password fields', () => {
    render(<Login />);
    expect(screen.getByText('ورود به سیستم تیکت')).toBeInTheDocument();
    expect(screen.getByLabelText(/نام کاربری/)).toBeInTheDocument();
    expect(screen.getByLabelText(/رمز عبور/)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<Login />);
    const submitBtn = screen.getByRole('button', { name: /ورود/ });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('نام کاربری الزامی است')).toBeInTheDocument();
      expect(screen.getByText('رمز عبور الزامی است')).toBeInTheDocument();
    });
  });

  it('has link to register', () => {
    render(<Login />);
    const link = screen.getByRole('link', { name: /ثبت‌نام/ });
    expect(link).toHaveAttribute('href', '/register');
  });
});
