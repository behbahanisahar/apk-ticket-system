import { Search } from 'lucide-react';
import { Button, Input, Select } from '../ui';

const STATUS_OPTS = [
  { value: 'all', label: 'همه' },
  { value: 'open', label: 'باز' },
  { value: 'in_progress', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته' },
];
const PRIORITY_OPTS = [
  { value: 'all', label: 'همه' },
  { value: 'low', label: 'کم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'زیاد' },
];

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
      className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40"
    >
      <div className="min-w-0 flex-1 sm:w-48">
        <Input label="جستجو" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)} placeholder="جستجو در تیکت‌ها..." />
      </div>
      <div className="w-full sm:w-36">
        <Select label="وضعیت" options={STATUS_OPTS} value={status} onChange={(e: { target: { value: string } }) => onStatusChange(e.target.value)} />
      </div>
      <div className="w-full sm:w-36">
        <Select label="اولویت" options={PRIORITY_OPTS} value={priority} onChange={(e: { target: { value: string } }) => onPriorityChange(e.target.value)} />
      </div>
      <Button type="submit" size="default">
        <Search className="me-2 h-4 w-4" />
        جستجو
      </Button>
    </form>
  );
}
