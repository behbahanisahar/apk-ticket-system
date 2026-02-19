import { toast as sonnerToast } from 'sonner';
import { getApiErrorMessage } from './apiError';

export const toast = {
  error: (errorOrMessage: unknown) => {
    const msg = typeof errorOrMessage === 'string' ? errorOrMessage : getApiErrorMessage(errorOrMessage);
    sonnerToast.error(msg);
  },
  success: (message: string) => sonnerToast.success(message),
};
