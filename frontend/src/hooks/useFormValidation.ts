import { useState, useCallback } from 'react';

export function useFormValidation<T extends Record<string, string | undefined>>(
  initialErrors: Partial<T> = {}
) {
  const [errors, setErrors] = useState<Partial<T>>(initialErrors);

  const validateAndSet = useCallback((getErrors: () => Partial<T>): boolean => {
    const nextErrors = getErrors();
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);

  const clearField = useCallback((key: keyof T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setErrors({}), []);

  return { errors, validateAndSet, clearField, clearAll };
}
