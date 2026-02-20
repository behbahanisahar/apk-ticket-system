import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>کلیک</Button>);
    expect(screen.getByRole('button', { name: 'کلیک' })).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Button disabled>کلیک</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards type submit', () => {
    render(<Button type="submit">ارسال</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
