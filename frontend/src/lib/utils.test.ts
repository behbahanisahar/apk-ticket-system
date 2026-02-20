import { describe, it, expect } from 'vitest';
import { toPersianDigits, getImageUrl } from './utils';

describe('toPersianDigits', () => {
  it('converts Arabic numerals to Persian', () => {
    expect(toPersianDigits(123)).toBe('۱۲۳');
    expect(toPersianDigits(0)).toBe('۰');
    expect(toPersianDigits(9876543210)).toBe('۹۸۷۶۵۴۳۲۱۰');
  });

  it('accepts string input', () => {
    expect(toPersianDigits('456')).toBe('۴۵۶');
  });

  it('preserves non-digit characters', () => {
    expect(toPersianDigits('TKT-000001')).toBe('TKT-۰۰۰۰۰۱');
  });
});

describe('getImageUrl', () => {
  it('returns null for null or undefined input', () => {
    expect(getImageUrl(null)).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getImageUrl('')).toBeNull();
  });

  it('returns URL as-is if it starts with http', () => {
    const url = 'https://example.com/image.jpg';
    expect(getImageUrl(url)).toBe(url);
  });

  it('prepends base URL for relative paths', () => {
    const result = getImageUrl('/media/tickets/2024/01/test.jpg');
    expect(result).toContain('/media/tickets/2024/01/test.jpg');
    expect(result).toMatch(/^http/);
  });

  it('handles paths without leading slash', () => {
    const result = getImageUrl('media/tickets/test.jpg');
    expect(result).toContain('media/tickets/test.jpg');
  });
});
