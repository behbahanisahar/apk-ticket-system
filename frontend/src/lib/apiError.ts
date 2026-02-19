import { AxiosError } from 'axios';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'درخواست نامعتبر',
  401: 'لطفاً دوباره وارد شوید',
  403: 'دسترسی غیرمجاز',
  404: 'موردی یافت نشد',
};

function formatFieldErrors(data: Record<string, unknown>): string[] {
  const msgs: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (key === 'detail') continue;
    if (Array.isArray(val)) {
      val.forEach((v) => (typeof v === 'string' ? msgs.push(`${key}: ${v}`) : null));
    } else if (typeof val === 'string') {
      msgs.push(val);
    }
  }
  return msgs;
}

export function getApiErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ detail?: string; non_field_errors?: string[] } & Record<string, unknown>>;
  const status = err.response?.status;
  const data = err.response?.data;

  if (status && STATUS_MESSAGES[status]) {
    const defaultMsg = STATUS_MESSAGES[status];
    if (data) {
      if (typeof data.detail === 'string') {
        if (status === 401 && /credential|account|invalid|incorrect|wrong|authenticate/i.test(data.detail))
          return 'نام کاربری یا رمز عبور اشتباه است';
        return data.detail;
      }
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
        const msg = data.non_field_errors[0];
        if (status === 401 && typeof msg === 'string' && /credential|account|invalid|incorrect|wrong|authenticate/i.test(msg))
          return 'نام کاربری یا رمز عبور اشتباه است';
        return msg;
      }
      if (status === 400) {
        const fieldErrs = formatFieldErrors(data);
        if (fieldErrs.length) return fieldErrs.join(' • ');
      }
    }
    return defaultMsg;
  }

  if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
    return 'اتصال به سرور برقرار نشد. اتصال اینترنت را بررسی کنید.';
  }
  if (err.code === 'ECONNABORTED') return 'درخواست قطع شد. لطفاً دوباره تلاش کنید.';

  return 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
}

export function isRetryableError(error: unknown): boolean {
  const err = error as AxiosError;
  const status = err.response?.status;
  if (status && status >= 400 && status < 500) return false;
  return true;
}
