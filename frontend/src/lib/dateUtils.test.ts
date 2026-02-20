import { describe, it, expect } from 'vitest';
import { formatDateTime, formatDateShort, formatDateOnly } from './dateUtils';

describe('dateUtils', () => {
  const isoDate = '2024-06-15T14:30:00.000Z';

  it('formatDateTime returns Persian locale string', () => {
    const result = formatDateTime(isoDate);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(5);
  });

  it('formatDateShort returns shorter format', () => {
    const result = formatDateShort(isoDate);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('formatDateOnly returns date without time', () => {
    const result = formatDateOnly(isoDate);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
