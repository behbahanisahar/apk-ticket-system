import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Select, Card, CardContent, CardActions } from '../components/ui';
import { APK_BRAND } from '../theme/brand';
import { useTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { getDisplayName } from '../types';
import { Pagination } from '../components/tickets';
import { toast } from '../lib/toast';

const STATUS_OPTS = [
  { value: 'open', label: 'باز' },
  { value: 'in_progress', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته' },
];
const statusColorClass: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-amber-100 text-amber-800',
  closed: 'bg-slate-100 text-slate-600',
};

export default function AdminDashboard() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data, isLoading } = useTickets({
    status: 'all',
    priority: 'all',
    search: '',
    limit,
    offset,
  });
  const tickets = data?.tickets ?? [];
  const count = data?.count ?? 0;
  const updateStatus = useUpdateTicketStatus();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate(
      { id, status },
      { onError: (e) => toast.error(e) }
    );
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex flex-1 items-center gap-2">
            <img src={APK_BRAND.logoUrl} alt="APK" className="h-9" />
            <Link to="/tickets" className="p-1 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-lg font-semibold text-slate-900">پنل ادمین</span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">همه تیکت‌ها</h3>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/60" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-lg font-semibold">{t.title}</h4>
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColorClass[t.status] || 'bg-slate-100'}`}>
                      {STATUS_OPTS.find((o) => o.value === t.status)?.label || t.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{t.description?.slice(0, 100)}...</p>
                  <p className="mt-1 text-xs text-slate-500">کاربر: {getDisplayName(t.user)}</p>
                </CardContent>
                <CardActions className="flex flex-wrap gap-2 px-4 pb-4">
                  <div className="min-w-[140px]">
                    <Select
                      value={t.status}
                      onChange={(e: { target: { value: string } }) => handleStatusChange(t.id, e.target.value)}
                      options={STATUS_OPTS}
                      size="small"
                    />
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/ticket/${t.id}`}>مشاهده</Link>
                  </Button>
                </CardActions>
              </Card>
            ))}
            {tickets.length === 0 && (
              <p className="py-16 text-center text-slate-600">تیکتی وجود ندارد</p>
            )}
            {count > limit && (
              <Pagination
                count={count}
                limit={limit}
                offset={offset}
                onPageChange={setOffset}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
