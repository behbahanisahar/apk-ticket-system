import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/test-utils';
import { TicketFilters } from './TicketFilters';

describe('TicketFilters', () => {
  it('renders search, status, and priority controls', () => {
    render(
      <TicketFilters
        search=""
        status="all"
        priority="all"
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText('جستجو در تیکت‌ها...')).toBeInTheDocument();
    expect(screen.getByText('وضعیت')).toBeInTheDocument();
    expect(screen.getByText('اولویت')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /جستجو/ })).toBeInTheDocument();
  });

  it('submits form on search button click', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const user = userEvent.setup();
    render(
      <TicketFilters
        search="test"
        status="all"
        priority="all"
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    await user.click(screen.getByRole('button', { name: /جستجو/ }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onSearchChange when typing', async () => {
    const onSearchChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TicketFilters
        search=""
        status="all"
        priority="all"
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    await user.type(screen.getByPlaceholderText('جستجو در تیکت‌ها...'), 'تیکت');
    expect(onSearchChange).toHaveBeenCalled();
  });
});
