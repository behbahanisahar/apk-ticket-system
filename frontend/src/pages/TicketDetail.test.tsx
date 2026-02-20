import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import { createMockUser } from '../test/test-utils';
import type { User } from '../types';
import { TicketStatus } from '../constants/tickets';

let mockAuthUser: User | null = null;
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...mod, useParams: () => ({ id: '1' }), useNavigate: () => vi.fn() };
});

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: mockAuthUser, loading: false }),
}));

const mockTicket = {
  id: 1,
  ticket_number: 'TKT-000001',
  title: 'تست تیکت',
  description: 'توضیحات',
  priority: 'medium',
  status: TicketStatus.Open,
  user: { id: 1, username: 'owner', first_name: 'مالک', last_name: 'تیکت', is_staff: false },
  responses: [] as never[],
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z',
};

vi.mock('../hooks/useTickets', () => ({
  useTicket: () => ({ data: mockTicket, isLoading: false, error: null, isError: false }),
  useRespondToTicket: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteTicket: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateTicketStatus: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateTicket: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../hooks/useConfirm', () => ({
  useConfirm: () => ({ confirm: vi.fn(), cancel: vi.fn(), confirming: false, show: vi.fn() }),
}));

vi.mock('../hooks/useQueryErrorToast', () => ({ useQueryErrorToast: () => {} }));

describe('TicketDetail - 3.4 minimum tests', () => {
  beforeEach(() => {
    mockAuthUser = null;
  });

  it('shows respond form when user is owner (appropriate access)', async () => {
    mockAuthUser = createMockUser({ id: 1, is_staff: false });
    const { default: TicketDetail } = await import('./TicketDetail');
    render(<TicketDetail />);
    expect(screen.getByLabelText(/ارسال پاسخ/)).toBeInTheDocument();
  });

  it('shows respond form when user is admin (appropriate access)', async () => {
    mockAuthUser = createMockUser({ id: 2, is_staff: true });
    const { default: TicketDetail } = await import('./TicketDetail');
    render(<TicketDetail />);
    expect(screen.getByLabelText(/ارسال پاسخ/)).toBeInTheDocument();
  });

  it('hides respond form when user is neither owner nor admin', async () => {
    mockAuthUser = createMockUser({ id: 999, is_staff: false });
    const { default: TicketDetail } = await import('./TicketDetail');
    render(<TicketDetail />);
    expect(screen.queryByLabelText(/ارسال پاسخ/)).not.toBeInTheDocument();
  });

  it('shows status change control for admin (accepted)', async () => {
    mockAuthUser = createMockUser({ is_staff: true });
    const { default: TicketDetail } = await import('./TicketDetail');
    render(<TicketDetail />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('hides status change control for regular user (rejected)', async () => {
    mockAuthUser = createMockUser({ is_staff: false });
    const { default: TicketDetail } = await import('./TicketDetail');
    render(<TicketDetail />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows validation error when submitting empty response', async () => {
    mockAuthUser = createMockUser({ id: 1, is_staff: false });
    const { default: TicketDetail } = await import('./TicketDetail');
    render(<TicketDetail />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /ارسال پاسخ/ }));
    await waitFor(() => {
      expect(screen.getByText('پاسخ الزامی است')).toBeInTheDocument();
    });
  });
});
