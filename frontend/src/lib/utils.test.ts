import { describe, it, expect } from 'vitest';
import { toPersianDigits } from './utils';

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
