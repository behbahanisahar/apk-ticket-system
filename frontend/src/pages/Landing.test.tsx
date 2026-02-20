import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import Landing from './Landing';

describe('Landing', () => {
  it('renders header with logo and login link', () => {
    render(<Landing />);
    const loginLinks = screen.getAllByRole('link', { name: 'ورود' });
    expect(loginLinks.some((l) => l.getAttribute('href') === '/login')).toBe(true);
  });

  it('renders landing content', () => {
    render(<Landing />);
    expect(screen.getByText('سیستم مدیریت')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'ورود' }).length).toBeGreaterThan(0);
  });
});
