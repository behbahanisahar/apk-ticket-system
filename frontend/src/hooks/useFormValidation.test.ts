import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  it('returns no errors initially', () => {
    const { result } = renderHook(() => useFormValidation<{ name?: string }>({}));
    expect(result.current.errors).toEqual({});
  });

  it('validateAndSet sets errors and returns false when invalid', () => {
    const { result } = renderHook(() => useFormValidation<{ name?: string }>({}));
    let isValid = true;
    act(() => {
      isValid = result.current.validateAndSet(() => ({ name: 'خطا' }));
    });
    expect(isValid).toBe(false);
    expect(result.current.errors).toEqual({ name: 'خطا' });
  });

  it('validateAndSet returns true when valid', () => {
    const { result } = renderHook(() => useFormValidation<{ name?: string }>({}));
    let isValid = false;
    act(() => {
      isValid = result.current.validateAndSet(() => ({}));
    });
    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('clearField removes error for field', () => {
    const { result } = renderHook(() => useFormValidation<{ name?: string }>({}));
    act(() => {
      result.current.validateAndSet(() => ({ name: 'خطا' }));
    });
    act(() => {
      result.current.clearField('name');
    });
    expect(result.current.errors).toEqual({});
  });
});
