import { Copy } from 'lucide-react';
import { toPersianDigits } from '../../lib/utils';
import { toast } from '../../lib/toast';
import { TEXT } from '../../theme';

interface CopyableTicketNumberProps {
  ticketNumber: string;
  className?: string;
  size?: 'sm' | 'xs';
}

export function CopyableTicketNumber({ ticketNumber, className = '', size = 'sm' }: CopyableTicketNumberProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(ticketNumber).then(
      () => toast.success('شماره تیکت کپی شد'),
      () => toast.error('کپی نشد')
    );
  };

  const textSize = size === 'xs' ? 'text-xs' : 'text-sm';
  const displayValue = toPersianDigits(ticketNumber);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 rounded-md tabular-nums transition-colors hover:bg-slate-100 px-2 py-1 -m-1 ${textSize} ${TEXT.muted} ${className}`}
      title="کپی شماره تیکت"
      aria-label={`کپی شماره تیکت ${ticketNumber}`}
    >
      <span>{displayValue}</span>
      <Copy className="h-3.5 w-3.5 shrink-0 opacity-60" />
    </button>
  );
}
