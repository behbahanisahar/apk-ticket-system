import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/test-utils';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('displays count text', () => {
    render(<Pagination count={25} limit={10} offset={0} onPageChange={vi.fn()} />);
    expect(screen.getByText(/۲۵/)).toBeInTheDocument();
  });

  it('disables prev on first page', () => {
    render(<Pagination count={25} limit={10} offset={0} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'صفحه قبلی' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'صفحه بعدی' })).not.toBeDisabled();
  });

  it('disables next on last page', () => {
    render(<Pagination count={15} limit={10} offset={10} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'صفحه قبلی' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'صفحه بعدی' })).toBeDisabled();
  });

  it('calls onPageChange when next clicked', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination count={25} limit={10} offset={0} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'صفحه بعدی' }));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it('shows empty message when count is 0', () => {
    render(<Pagination count={0} limit={10} offset={0} onPageChange={vi.fn()} />);
    expect(screen.getByText('تیکتی یافت نشد')).toBeInTheDocument();
  });
});
