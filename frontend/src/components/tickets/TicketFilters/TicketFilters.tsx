import { Search } from 'lucide-react';
import { Button, Input, Select } from '../../ui';
import { STATUS_OPTIONS_WITH_ALL, PRIORITY_OPTIONS_WITH_ALL } from '../../../constants/tickets';
import { BORDER, BG, RING } from '../../../theme';

interface TicketFiltersProps {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TicketFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSubmit,
}: TicketFiltersProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`mb-8 flex flex-wrap items-end gap-4 rounded-2xl border ${BORDER.default} ${BG.surface} p-6 shadow-lg shadow-slate-200/40 ring-1 ${RING.light}`}
    >
      <div className="min-w-0 flex-1 sm:w-48">
        <Input label="جستجو" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)} placeholder="جستجو در تیکت‌ها..." />
      </div>
      <div className="w-full sm:w-36">
        <Select label="وضعیت" options={STATUS_OPTIONS_WITH_ALL} value={status} onChange={(e: { target: { value: string } }) => onStatusChange(e.target.value)} />
      </div>
      <div className="w-full sm:w-36">
        <Select label="اولویت" options={PRIORITY_OPTIONS_WITH_ALL} value={priority} onChange={(e: { target: { value: string } }) => onPriorityChange(e.target.value)} />
      </div>
      <Button type="submit" variant="secondary" size="default">
        <Search className="me-2 h-4 w-4" />
        جستجو
      </Button>
    </form>
  );
}
