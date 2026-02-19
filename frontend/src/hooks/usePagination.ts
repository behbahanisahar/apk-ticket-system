import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialOffset?: number;
}

export function usePagination({ initialOffset = 0 }: UsePaginationOptions = {}) {
  const [offset, setOffset] = useState(initialOffset);

  const onPageChange = useCallback((newOffset: number) => {
    setOffset(newOffset);
  }, []);

  const resetOffset = useCallback(() => setOffset(0), []);

  return {
    offset,
    setOffset,
    onPageChange,
    resetOffset,
  };
}
