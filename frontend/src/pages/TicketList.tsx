import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Ticket, PaginatedResponse } from '../types';
import { APK_BRAND } from '../theme/brand';
import { TicketCard, TicketFilters, TicketListSkeleton } from '../components/tickets';
import { Button } from '../components/ui';

export default function TicketList() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTickets = () => {
    const params: Record<string, string> = {};
    if (status && status !== 'all') params.status = status;
    if (priority && priority !== 'all') params.priority = priority;
    if (search) params.search = search;
    setLoading(true);
    api.get<PaginatedResponse<Ticket[]> | Ticket[]>('/tickets/', { params })
      .then((r) => {
        const data = r.data;
        setTickets(Array.isArray(data) ? data : (data.results || []));
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, [status, priority]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/tickets" className="flex flex-1 items-center gap-3 no-underline">
            <img src={APK_BRAND.logoUrl} alt="APK" className="h-9" />
            <span className="text-lg font-semibold text-slate-900">تیکت‌ها</span>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/new" className="text-primary">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
          {user?.is_staff && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <Shield className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <TicketFilters
          search={search}
          status={status}
          priority={priority}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onSubmit={handleSearch}
        />
        {loading ? (
          <TicketListSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
            {tickets.length === 0 && (
              <p className="py-16 text-center text-slate-600">تیکتی وجود ندارد</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
