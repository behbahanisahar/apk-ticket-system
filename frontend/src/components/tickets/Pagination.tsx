import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui';
import { TEXT } from '../../theme';
import { toPersianDigits } from '../../lib/utils';

interface PaginationProps {
  count: number;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
}

export function Pagination({ count, limit, offset, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(count / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;
  const hasPrev = offset > 0;
  const hasNext = offset + limit < count;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <p className={`text-sm ${TEXT.muted}`}>
        {count > 0
          ? `نمایش ${toPersianDigits(offset + 1)} تا ${toPersianDigits(Math.min(offset + limit, count))} از ${toPersianDigits(count)} تیکت`
          : 'تیکتی یافت نشد'}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={!hasPrev}
          aria-label="صفحه قبلی"
        >
          <ChevronRight className="h-4 w-4" />
          قبلی
        </Button>
        <span className={`text-sm ${TEXT.muted}`}>
          صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(offset + limit)}
          disabled={!hasNext}
          aria-label="صفحه بعدی"
        >
          بعدی
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
