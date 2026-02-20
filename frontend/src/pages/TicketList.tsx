import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APK_BRAND } from '../theme/brand';
import { TicketCard, TicketFilters, TicketListSkeleton, TicketTable, Pagination } from '../components/tickets';
import { Button, Select } from '../components/ui';
import { useTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePagination } from '../hooks/usePagination';
import { useQueryErrorToast } from '../hooks/useQueryErrorToast';
import { Ticket, getDisplayName } from '../types';
import { SORT_OPTIONS } from '../constants/tickets';
import { TEXT, BORDER, BG } from '../theme';
import { toast } from '../lib/toast';

type ViewMode = 'table' | 'cards';

const parseViewMode = (v: string): ViewMode | null =>
  v === 'table' || v === 'cards' ? v : null;

export default function TicketList() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('ticketListView', 'table', parseViewMode);
  const { offset, onPageChange, resetOffset } = usePagination();

  const isAdmin = user?.is_staff ?? false;
  const showTableView = isAdmin || viewMode === 'table';
  const limit = showTableView ? 15 : 10;

  const { data, isLoading, isError, error } = useTickets({
    status,
    priority,
    search: searchSubmitted,
    limit,
    offset,
    ordering: showTableView ? ordering : undefined,
  });

  useQueryErrorToast(isError, error);

  const tickets = data?.tickets ?? [];
  const count = data?.count ?? 0;
  const updateStatus = useUpdateTicketStatus();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus }, { onError: (e) => toast.error(e) });
  };

  useEffect(() => resetOffset(), [status, priority]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(search);
    resetOffset();
  };

  const handleOrderingChange = (value: string) => {
    setOrdering(value);
    resetOffset();
  };

  return (
    <>
      <header className={`sticky top-0 z-10 border-b ${BORDER.default} ${BG.header} shadow-md backdrop-blur`}>
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/tickets" className="flex flex-1 items-center gap-3 no-underline">
            <img src={APK_BRAND.logoUrl} alt="APK" className="h-9" />
            <span className={`text-lg font-bold ${TEXT.heading}`}>تیکت‌ها</span>
          </Link>
          <Button variant="default" size="sm" asChild>
            <Link to="/new" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">تیکت جدید</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${TEXT.muted}`}>{getDisplayName(user)}</span>
            <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl">
              <LogOut className="h-5 w-5 rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      </header>
      <div className={`min-h-screen ${BG.page}`}>
        <div className="mx-auto max-w-5xl px-4 py-8">
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
            <h2 className={`text-base font-bold ${TEXT.heading}`}>{isAdmin ? 'همه تیکت‌ها' : 'تیکت‌های من'}</h2>
            <div className="flex flex-wrap items-center gap-3">
              {!isAdmin && (
                <div
                  role="tablist"
                  aria-label="نوع نمایش"
                  className={`flex rounded-lg border ${BORDER.default} ${BG.surface} p-0.5 shadow-sm`}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'table'}
                    aria-controls="ticket-list-panel"
                    id="view-tab-table"
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === 'table' ? BG.tabActive : BG.tabInactive
                    }`}
                    title="نمایش جدولی"
                  >
                    <List className="h-4 w-4" />
                    جدول
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'cards'}
                    aria-controls="ticket-list-panel"
                    id="view-tab-cards"
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === 'cards' ? BG.tabActive : BG.tabInactive
                    }`}
                    title="نمایش کارتی"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    کارت
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ArrowUpDown className={`h-4 w-4 ${TEXT.subtle}`} aria-hidden />
                <div className="min-w-[160px]">
                  <Select
                    options={SORT_OPTIONS}
                    value={ordering}
                    onChange={(e: { target: { value: string } }) => handleOrderingChange(e.target.value)}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>

          <div id="ticket-list-panel" role="tabpanel" aria-labelledby={viewMode === 'table' ? 'view-tab-table' : 'view-tab-cards'}>
            {showTableView ? (
              <>
                <TicketTable
                  tickets={tickets}
                  isAdmin={isAdmin}
                  onStatusChange={isAdmin ? handleStatusChange : undefined}
                  isLoading={isLoading}
                />
                {count > 0 && (
                  <Pagination count={count} limit={limit} offset={offset} onPageChange={onPageChange} />
                )}
              </>
            ) : (
              <>
                {isLoading ? (
                  <TicketListSkeleton />
                ) : tickets.length === 0 ? (
                  <p className={`py-16 text-center ${TEXT.muted}`}>تیکتی وجود ندارد</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {tickets.map((t: Ticket) => (
                        <TicketCard key={t.id} ticket={t} />
                      ))}
                    </div>
                    {count > 0 && (
                      <Pagination count={count} limit={limit} offset={offset} onPageChange={onPageChange} />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
