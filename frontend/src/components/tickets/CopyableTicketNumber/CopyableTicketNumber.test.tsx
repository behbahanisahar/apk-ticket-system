import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import { CopyableTicketNumber } from './CopyableTicketNumber';
import { toast } from '../../../lib/toast';

describe('CopyableTicketNumber', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
  });

  it('displays ticket number in Persian digits', () => {
    render(<CopyableTicketNumber ticketNumber="TKT-000001" />);
    expect(screen.getByText(/TKT-[0-9۰-۹]+/)).toBeInTheDocument();
  });

  it('copies to clipboard on click', async () => {
    render(<CopyableTicketNumber ticketNumber="TKT-000001" />);
    fireEvent.click(screen.getByRole('button', { name: /کپی شماره تیکت TKT-000001/ }));
    expect(writeText).toHaveBeenCalledWith('TKT-000001');
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('شماره تیکت کپی شد');
    });
  });

  it('shows error toast when copy fails', async () => {
    writeText.mockRejectedValueOnce(new Error('clipboard error'));
    render(<CopyableTicketNumber ticketNumber="TKT-000001" />);
    fireEvent.click(screen.getByRole('button', { name: /کپی شماره تیکت/ }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('کپی نشد');
    });
  });
});
