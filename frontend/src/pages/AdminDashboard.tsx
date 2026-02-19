import { useState, useMemo } from 'react';
import { ArrowUpDown, ClipboardList } from 'lucide-react';
import { Select, Card, BackLink } from '../components/ui';
import { APK_BRAND } from '../theme/brand';
import { useTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { usePagination } from '../hooks/usePagination';
import { Ticket } from '../types';
import { TicketTable, TicketFilters, Pagination } from '../components/tickets';
import { toast } from '../lib/toast';
import { TEXT, BORDER, BG } from '../theme';
import { SORT_OPTIONS, TicketStatus } from '../constants/tickets';

export default function AdminDashboard() {
  const [ordering, setOrdering] = useState('-created_at');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState('');
  const limit = 15;
  const { offset, setOffset, onPageChange, resetOffset } = usePagination();

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
    resetOffset();
  };

  const tickets = data?.tickets ?? [];
  const count = data?.count ?? 0;
  const updateStatus = useUpdateTicketStatus();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus }, { onError: (e) => toast.error(e) });
  };

  const stats = useMemo(() => {
    const open = tickets.filter((t: Ticket) => t.status === TicketStatus.Open).length;
    const inProgress = tickets.filter((t: Ticket) => t.status === TicketStatus.InProgress).length;
    const closed = tickets.filter((t: Ticket) => t.status === TicketStatus.Closed).length;
    return { open, inProgress, closed };
  }, [tickets]);

  return (
    <div className={`min-h-screen ${BG.page}`}>
      <header className={`sticky top-0 z-10 border-b ${BORDER.default} ${BG.header} shadow-md backdrop-blur`}>
        <div className="flex items-center gap-4 px-4 py-4">
          <img src={APK_BRAND.logoUrl} alt="APK" className="h-9" />
          <div className="flex flex-1 justify-end">
            <BackLink to="/tickets" />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 ring-1 ring-primary/20">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span className={`text-lg font-bold ${TEXT.heading}`}>پنل ادمین</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <TicketFilters
          search={search}
          status={status}
          priority={priority}
          onSearchChange={setSearch}
          onStatusChange={(v) => {
            setStatus(v);
            resetOffset();
          }}
          onPriorityChange={(v) => {
            setPriority(v);
            resetOffset();
          }}
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
              <span className={`text-xs font-medium ${TEXT.muted}`}>بسته</span>
              <span className={`ms-2 text-lg font-bold ${TEXT.label}`}>{stats.closed}</span>
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className={`text-xl font-bold ${TEXT.heading}`}>همه تیکت‌ها</h1>
          <div className="flex items-center gap-2">
            <ArrowUpDown className={`h-4 w-4 ${TEXT.subtle}`} aria-hidden />
            <div className="min-w-[160px]">
              <Select
                options={SORT_OPTIONS}
                value={ordering}
                onChange={(e: { target: { value: string } }) => {
                  setOrdering(e.target.value);
                  resetOffset();
                }}
                size="small"
              />
            </div>
          </div>
        </div>

        <TicketTable
          tickets={tickets}
          isAdmin
          onStatusChange={handleStatusChange}
          isLoading={isLoading}
          emptyContent={
            <Card className={`border-2 border-dashed ${BORDER.dashed} py-20 text-center`}>
              <ClipboardList className={`mx-auto mb-3 h-12 w-12 ${BG.emptyIcon}`} />
              <p className={TEXT.subtle}>تیکتی وجود ندارد</p>
            </Card>
          }
        />

        {count > limit && (
          <Pagination count={count} limit={limit} offset={offset} onPageChange={onPageChange} />
        )}
      </main>
    </div>
  );
}
