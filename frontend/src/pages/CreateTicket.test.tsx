import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import CreateTicket from './CreateTicket';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useNavigate: () => mockNavigate };
});

vi.mock('../hooks/useTickets', () => ({
  useCreateTicket: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}));

describe('CreateTicket', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders create ticket form', () => {
    render(<CreateTicket />);
    expect(screen.getByText('تیکت جدید')).toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان/)).toBeInTheDocument();
    expect(screen.getByLabelText(/توضیحات/)).toBeInTheDocument();
  });

  it('shows validation error for short title', async () => {
    const user = userEvent.setup();
    render(<CreateTicket />);
    await user.type(screen.getByLabelText(/عنوان/), 'ab');
    await user.type(screen.getByLabelText(/توضیحات/), 'توضیحات کافی برای تیکت');
    await user.click(screen.getByRole('button', { name: 'ایجاد تیکت' }));
    await waitFor(() => {
      expect(screen.getByText('عنوان حداقل ۳ کاراکتر باشد')).toBeInTheDocument();
    });
  });

  it('shows validation error for short description', async () => {
    const user = userEvent.setup();
    render(<CreateTicket />);
    await user.type(screen.getByLabelText(/عنوان/), 'عنوان تیکت');
    await user.type(screen.getByLabelText(/توضیحات/), 'کم');
    await user.click(screen.getByRole('button', { name: 'ایجاد تیکت' }));
    await waitFor(() => {
      expect(screen.getByText('توضیحات حداقل ۱۰ کاراکتر باشد')).toBeInTheDocument();
    });
  });
});
