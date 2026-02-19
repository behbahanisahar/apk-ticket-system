import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, ChevronLeft, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APK_BRAND } from '../theme/brand';
import { TicketCard, TicketFilters, TicketListSkeleton, Pagination } from '../components/tickets';
import { Button, Select } from '../components/ui';
import { useTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { getDisplayName } from '../types';
import { formatDateTime } from '../lib/dateUtils';
import { toast } from '../lib/toast';

const TICKET_VIEW_KEY = 'ticketListView';

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
function statusLabel(s: string) {
  return STATUS_OPTS.find((o) => o.value === s)?.label || s;
}
function priorityLabel(p: string) {
  return PRIORITY_OPTS.find((o) => o.value === p)?.label || p;
}

type ViewMode = 'table' | 'cards';

function getStoredViewMode(): ViewMode {
  try {
    const v = localStorage.getItem(TICKET_VIEW_KEY);
    if (v === 'table' || v === 'cards') return v;
  } catch {
    /* ignore */
  }
  return 'table';
}

export default function TicketList() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState('');
  const [offset, setOffset] = useState(0);
  const [ordering, setOrdering] = useState('-created_at');
  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);
  const isAdmin = user?.is_staff ?? false;
  const showTableView = isAdmin || viewMode === 'table';
  const limit = showTableView ? 15 : 10;

  const setViewModePersisted = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(TICKET_VIEW_KEY, mode);
    } catch {
      /* ignore */
    }
  };

  const { data, isLoading, isError, error } = useTickets({
    status,
    priority,
    search: searchSubmitted,
    limit,
    offset,
    ordering: showTableView ? ordering : undefined,
  });

  const tickets = data?.tickets ?? [];
  const count = data?.count ?? 0;
  const updateStatus = useUpdateTicketStatus();

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate({ id, status }, { onError: (e) => toast.error(e) });
  };

  useEffect(() => {
    setOffset(0);
  }, [status, priority]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(search);
    setOffset(0);
  };

  useEffect(() => {
    if (isError && error) toast.error(error);
  }, [isError, error]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 shadow-md backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/tickets" className="flex flex-1 items-center gap-3 no-underline">
            <img src={APK_BRAND.logoUrl} alt="APK" className="h-9" />
            <span className="text-lg font-bold text-slate-900">تیکت‌ها</span>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/new" className="rounded-xl text-primary transition-colors hover:bg-primary/10">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hover:bg-slate-100">
            <LogOut className="h-5 w-5 rtl:-scale-x-100" />
          </Button>
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
        <div className={`mx-auto px-4 py-8 ${isAdmin ? 'max-w-5xl' : 'max-w-5xl'}`}>
          <TicketFilters
            search={search}
            status={status}
            priority={priority}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            onSubmit={handleSearch}
          />
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900">{isAdmin ? 'همه تیکت‌ها' : 'تیکت‌های من'}</h2>
              <div className="flex flex-wrap items-center gap-3">
                {!isAdmin && (
                  <div className="flex rounded-lg border border-slate-200/80 bg-white p-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setViewModePersisted('table')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="نمایش جدولی"
                    >
                      <List className="h-4 w-4" />
                      جدول
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewModePersisted('cards')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        viewMode === 'cards' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="نمایش کارتی"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      کارت
                    </button>
                  </div>
                )}
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
            </div>
          {isLoading ? (
            showTableView ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow">
                <table className="w-full min-w-0 md:min-w-[480px] lg:min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/80">
                      <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 md:table-cell">شماره</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">عنوان</th>
                      {isAdmin && <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 lg:table-cell">کاربر</th>}
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">وضعیت</th>
                      <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 md:table-cell">اولویت</th>
                      <th className="hidden px-4 py-3 text-right text-xs font-semibold text-slate-600 sm:table-cell">ایجاد</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td colSpan={isAdmin ? 7 : 6} className="h-14 animate-pulse bg-slate-100/50 px-4" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <TicketListSkeleton />
            )
          ) : tickets.length === 0 ? (
            <p className="py-16 text-center text-slate-600">تیکتی وجود ندارد</p>
          ) : showTableView ? (
            <>
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-lg">
                <table className="w-full min-w-0 md:min-w-[480px] lg:min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/80">
                      <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 md:table-cell">شماره</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">عنوان</th>
                      {isAdmin && (
                        <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 lg:table-cell">کاربر</th>
                      )}
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
                        {isAdmin && (
                          <td className="hidden px-4 py-3 text-sm text-slate-700 lg:table-cell">{getDisplayName(t.user)}</td>
                        )}
                        <td className="px-4 py-3">
                          {isAdmin ? (
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
                          ) : (
                            <span
                              className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${statusColorClass[t.status] || 'bg-slate-100 text-slate-600'}`}
                            >
                              {statusLabel(t.status)}
                            </span>
                          )}
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
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tickets.map((t) => (
                  <TicketCard key={t.id} ticket={t} />
                ))}
              </div>
              {count > limit && (
                <Pagination
                  count={count}
                  limit={limit}
                  offset={offset}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
