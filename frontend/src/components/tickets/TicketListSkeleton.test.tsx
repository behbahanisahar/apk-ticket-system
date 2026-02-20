import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../test/test-utils';
import { TicketListSkeleton } from './TicketListSkeleton';

describe('TicketListSkeleton', () => {
  it('renders 3 skeleton placeholders', () => {
    const { container } = render(<TicketListSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });
});
