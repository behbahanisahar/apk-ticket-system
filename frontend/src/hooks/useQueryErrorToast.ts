import { useEffect } from 'react';
import { toast } from '../lib/toast';

export function useQueryErrorToast(isError: boolean, error: unknown) {
  useEffect(() => {
    if (isError && error) {
      toast.error(error);
    }
  }, [isError, error]);
}
