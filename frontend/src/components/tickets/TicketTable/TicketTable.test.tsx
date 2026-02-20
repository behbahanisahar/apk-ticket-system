import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import { TicketTable } from './TicketTable';
import type { Ticket } from '../../../types';
import { TicketStatus, TicketPriority } from '../../../constants/tickets';

const mockTickets: Ticket[] = [
  {
    id: 1,
    ticket_number: 'TKT-000001',
    title: 'تست تیکت ',
    description: 'توضیحات',
    priority: TicketPriority.Medium,
    status: TicketStatus.Open,
    user: { id: 1, username: 'owner1', email: 'owner1@test.com', first_name: 'مالک', last_name: 'تیکت', is_staff: false },
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
];

describe('TicketTable - 3.4 minimum tests', () => {
  it('displays owner when admin (create ticket and check ownership)', () => {
    render(
      <TicketTable tickets={mockTickets} isAdmin onStatusChange={vi.fn()} />
    );
    expect(screen.getByText('مالک تیکت')).toBeInTheDocument();
  });

  it('shows status change control for admin but not for user', () => {
    const { rerender } = render(
      <TicketTable tickets={mockTickets} isAdmin onStatusChange={vi.fn()} />
    );
    const adminStatusCell = screen.getByRole('combobox', { name: '' });
    expect(adminStatusCell).toBeInTheDocument();

    rerender(
      <TicketTable tickets={mockTickets} isAdmin={false} />
    );
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByText('باز')).toBeInTheDocument();
  });
});
