import { describe, it, expect } from 'vitest';
import { getDisplayName } from './index';

describe('getDisplayName', () => {
  it('returns full name when first_name and last_name exist', () => {
    expect(
      getDisplayName({
        id: 1,
        username: 'john',
        email: 'j@x.com',
        first_name: 'جان',
        last_name: 'دو',
        is_staff: false,
      })
    ).toBe('جان دو');
  });

  it('returns username when no first/last name', () => {
    expect(
      getDisplayName({
        id: 1,
        username: 'john',
        email: 'j@x.com',
        is_staff: false,
      })
    ).toBe('john');
  });

  it('returns empty string for null/undefined', () => {
    expect(getDisplayName(null)).toBe('');
    expect(getDisplayName(undefined)).toBe('');
  });
});
