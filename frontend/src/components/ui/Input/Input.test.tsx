import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/test-utils';
import { Input } from './input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="نام" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('نام')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input label="نام" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText('نام'), 'م');
    expect(onChange).toHaveBeenCalled();
  });
});
