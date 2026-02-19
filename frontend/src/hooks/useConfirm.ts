import { useState, useCallback } from 'react';

export function useConfirm<T>(onConfirm: (value: T) => void) {
  const [confirming, setConfirming] = useState(false);
  const [pendingValue, setPendingValue] = useState<T | null>(null);

  const show = useCallback((value: T) => {
    setPendingValue(value);
    setConfirming(true);
  }, []);

  const confirm = useCallback(() => {
    if (pendingValue !== null) {
      onConfirm(pendingValue);
    }
    setPendingValue(null);
    setConfirming(false);
  }, [onConfirm, pendingValue]);

  const cancel = useCallback(() => {
    setPendingValue(null);
    setConfirming(false);
  }, []);

  return { confirming, show, confirm, cancel };
}
