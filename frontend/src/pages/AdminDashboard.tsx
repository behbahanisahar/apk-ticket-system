import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpDown, ChevronLeft, ClipboardList } from 'lucide-react';
import { Button, Select, Card } from '../components/ui';
import { APK_BRAND } from '../theme/brand';
import { useTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { getDisplayName } from '../types';
import { formatDateTime } from '../lib/dateUtils';
import { Pagination, TicketFilters } from '../components/tickets';
import { toast } from '../lib/toast';

const STATUS_OPTS = [
  { value: 'open', label: 'باز' },
  { value: 'in_progress', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته' },
];
const SORT_OPTS = [
  { value: '-created_at', label: 'جدیدترین اول' },
  { value: 'created_at', label: 'قدیمی‌ترین اول' },
  { value: '-updated_at', label: 'آخرین بروزرسانی' },
];
const PRIORITY_OPTS = [
  { value: 'low', label: 'کم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'زیاد' },
];
const statusColorClass: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-amber-100 text-amber-800',
  closed: 'bg-slate-100 text-slate-600',
};
function priorityLabel(p: string) {
  return PRIORITY_OPTS.find((o) => o.value === p)?.label || p;
}

export default function AdminDashboard() {
  const [offset, setOffset] = useState(0);
  const [ordering, setOrdering] = useState('-created_at');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState('');
  const limit = 15;
  const { data, isLoading } = useTickets({
    status,
    priority,
    search: searchSubmitted,
    limit,
    offset,
    ordering,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(search);
    setOffset(0);
  };
  const tickets = data?.tickets ?? [];
  const count = data?.count ?? 0;
  const updateStatus = useUpdateTicketStatus();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate(
      { id, status },
      { onError: (e) => toast.error(e) }
    );
  };

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
    const closed = tickets.filter((t) => t.status === 'closed').length;
    return { open, inProgress, closed };
  }, [tickets]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 shadow-md backdrop-blur">
        <div className="flex items-center gap-4 px-4 py-4">
          <img src={APK_BRAND.logoUrl} alt="APK" className="h-9" />
          <div className="flex flex-1 justify-end">
            <Link
              to="/tickets"
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 px-3 py-2 text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">بازگشت</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 ring-1 ring-primary/20">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-slate-900">پنل ادمین</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <TicketFilters
          search={search}
          status={status}
          priority={priority}
          onSearchChange={setSearch}
          onStatusChange={(v) => { setStatus(v); setOffset(0); }}
          onPriorityChange={(v) => { setPriority(v); setOffset(0); }}
          onSubmit={handleSearch}
        />

        {!isLoading && tickets.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="rounded-xl bg-emerald-50 px-4 py-2 ring-1 ring-emerald-200/60">
              <span className="text-xs font-medium text-emerald-700">باز</span>
              <span className="ms-2 text-lg font-bold text-emerald-800">{stats.open}</span>
            </div>
            <div className="rounded-xl bg-amber-50 px-4 py-2 ring-1 ring-amber-200/60">
              <span className="text-xs font-medium text-amber-700">در حال بررسی</span>
              <span className="ms-2 text-lg font-bold text-amber-800">{stats.inProgress}</span>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-2 ring-1 ring-slate-200/60">
              <span className="text-xs font-medium text-slate-600">بسته</span>
              <span className="ms-2 text-lg font-bold text-slate-700">{stats.closed}</span>
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900">همه تیکت‌ها</h1>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-500" />
            <div className="min-w-[160px]">
              <Select
                options={SORT_OPTS}
                value={ordering}
                onChange={(e: { target: { value: string } }) => {
                  setOrdering(e.target.value);
                  setOffset(0);
                }}
                size="small"
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow">
            <table className="w-full min-w-0 md:min-w-[480px] lg:min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80">
                  <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 md:table-cell">شماره</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">عنوان</th>
                  <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 lg:table-cell">کاربر</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">وضعیت</th>
                  <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 md:table-cell">اولویت</th>
                  <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 sm:table-cell">ایجاد</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td colSpan={7} className="h-14 animate-pulse bg-slate-100/50 px-4" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tickets.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-200 py-20 text-center">
            <ClipboardList className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">تیکتی وجود ندارد</p>
          </Card>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-lg">
              <table className="w-full min-w-0 md:min-w-[480px] lg:min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80">
                    <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 md:table-cell">شماره</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">عنوان</th>
                    <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 lg:table-cell">کاربر</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">وضعیت</th>
                    <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 md:table-cell">اولویت</th>
                    <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 sm:table-cell">ایجاد</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="hidden px-4 py-3 md:table-cell">
                        <span className="font-mono text-sm text-slate-600">#{t.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/ticket/${t.id}`}
                          className="max-w-[180px] truncate font-medium text-slate-900 no-underline hover:text-primary sm:max-w-[240px] md:max-w-[280px]"
                          title={t.title}
                        >
                          {t.title}
                        </Link>
                        <p className="mt-0.5 hidden max-w-[200px] truncate text-xs text-slate-500 sm:block md:max-w-[280px]" title={t.description}>
                          {t.description}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-slate-700 lg:table-cell">{getDisplayName(t.user)}</td>
                      <td className="px-4 py-3">
                        <div className="min-w-[90px] md:min-w-[100px]">
                          <Select
                            value={t.status}
                            onChange={(e: { target: { value: string } }) =>
                              handleStatusChange(t.id, e.target.value)
                            }
                            options={STATUS_OPTS}
                            size="small"
                          />
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <span className="text-sm text-slate-600">{priorityLabel(t.priority)}</span>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-slate-500 sm:table-cell">
                        {formatDateTime(t.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/ticket/${t.id}`} className="inline-flex items-center gap-1">
                            مشاهده
                            <ChevronLeft className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {count > limit && (
              <Pagination
                count={count}
                limit={limit}
                offset={offset}
                onPageChange={setOffset}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
