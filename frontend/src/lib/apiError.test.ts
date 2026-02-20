import { describe, it, expect } from 'vitest';
import { getApiErrorMessage, isRetryableError } from './apiError';
import { AxiosError, AxiosHeaders } from 'axios';

function makeError(status?: number, data?: unknown): AxiosError {
  const err = new Error() as AxiosError;
  err.response = status
    ? {
        status,
        data,
        statusText: '',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    : undefined;
  err.code = undefined;
  return err;
}

describe('getApiErrorMessage', () => {
  it('returns Persian message for 400', () => {
    expect(getApiErrorMessage(makeError(400))).toBe('درخواست نامعتبر');
  });

  it('returns Persian message for 401', () => {
    expect(getApiErrorMessage(makeError(401))).toBe('لطفاً دوباره وارد شوید');
  });

  it('returns Persian message for 403', () => {
    expect(getApiErrorMessage(makeError(403))).toBe('دسترسی غیرمجاز');
  });

  it('returns Persian message for 404', () => {
    expect(getApiErrorMessage(makeError(404))).toBe('موردی یافت نشد');
  });

  it('returns field errors for 400 with data', () => {
    const err = makeError(400, { username: ['این فیلد الزامی است'] });
    expect(getApiErrorMessage(err)).toContain('username');
  });

  it('returns default message for unknown error', () => {
    expect(getApiErrorMessage(new Error())).toBe('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
  });
});

describe('isRetryableError', () => {
  it('returns false for 4xx errors', () => {
    expect(isRetryableError(makeError(400))).toBe(false);
    expect(isRetryableError(makeError(404))).toBe(false);
  });

  it('returns true for 5xx or network errors', () => {
    expect(isRetryableError(makeError(500))).toBe(true);
    const networkErr = makeError();
    networkErr.code = 'ERR_NETWORK';
    expect(isRetryableError(networkErr)).toBe(true);
  });
});
