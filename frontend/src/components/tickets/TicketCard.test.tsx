import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../test/test-utils';
import { TicketCard } from './TicketCard';
import type { Ticket } from '../../types';
import { TicketStatus, TicketPriority } from '../../constants/tickets';

const mockTicket: Ticket = {
  id: 1,
  ticket_number: 'TKT-000001',
  title: 'تست تیکت',
  description: 'توضیحات تیکت برای تست',
  priority: TicketPriority.Medium,
  status: TicketStatus.Open,
  user: { id: 1, username: 'user', email: 'user@test.com', is_staff: false },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

describe('TicketCard', () => {
  it('renders ticket title and description', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByRole('heading', { name: 'تست تیکت' })).toBeInTheDocument();
    expect(screen.getByText('توضیحات تیکت برای تست')).toBeInTheDocument();
  });

  it('links to ticket detail page', () => {
    render(<TicketCard ticket={mockTicket} />);
    const link = screen.getByRole('link', { name: /تست تیکت/ });
    expect(link).toHaveAttribute('href', '/ticket/1');
  });

  it('shows status badge', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByText('باز')).toBeInTheDocument();
  });
});
