import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button, Select } from '../../ui';
import { Ticket } from '../../../types';
import { getDisplayName } from '../../../types';
import { formatDateOnly, formatDateTime } from '../../../lib/dateUtils';
import {
  STATUS_OPTIONS,
  STATUS_COLOR_CLASS,
  PRIORITY_DOT_CLASS,
  getStatusLabel,
  getPriorityLabel,
} from '../../../constants/tickets';
import { TEXT, BORDER, BG } from '../../../theme';
import { CopyableTicketNumber } from '../CopyableTicketNumber';

interface TicketTableProps {
  tickets: Ticket[];
  isAdmin: boolean;
  onStatusChange?: (id: number, status: string) => void;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  emptyContent?: React.ReactNode;
}

function TicketTableSkeleton({ isAdmin }: { isAdmin: boolean }) {
  const colCount = isAdmin ? 7 : 6;
  return (
    <div className={`overflow-hidden rounded-2xl border ${BORDER.default} ${BG.surface} shadow`}>
      <table className="w-full min-w-0 md:min-w-[480px] lg:min-w-[640px]">
        <thead>
          <tr className={`border-b ${BORDER.default} ${BG.muted}`}>
            <th className={`hidden w-24 shrink-0 px-4 py-3 text-right text-xs font-semibold ${TEXT.muted} md:table-cell`}>شماره</th>
            <th className={`px-4 py-3 text-right text-xs font-semibold ${TEXT.muted}`}>عنوان</th>
            {isAdmin && <th className={`hidden px-4 py-3 text-right text-xs font-semibold ${TEXT.muted} lg:table-cell`}>کاربر</th>}
            <th className={`min-w-[150px] shrink-0 px-4 py-3 text-right text-xs font-semibold ${TEXT.muted}`}>وضعیت</th>
            <th className={`hidden px-4 py-3 text-right text-xs font-semibold ${TEXT.muted} md:table-cell`}>اولویت</th>
            <th className={`hidden w-24 shrink-0 px-4 py-3 text-right text-xs font-semibold ${TEXT.muted} sm:table-cell`}>ایجاد</th>
            <th className={`px-4 py-3 text-right text-xs font-semibold ${TEXT.muted}`}>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <tr key={i} className={`border-b ${BORDER.divider} last:border-0`}>
              <td colSpan={colCount} className={`h-14 animate-pulse ${BG.empty} px-4`} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TicketTable({
  tickets,
  isAdmin,
  onStatusChange,
  isLoading = false,
  emptyMessage = 'تیکتی وجود ندارد',
  emptyContent,
}: TicketTableProps) {
  if (isLoading) {
    return <TicketTableSkeleton isAdmin={isAdmin} />;
  }

  if (tickets.length === 0) {
    if (emptyContent) return <>{emptyContent}</>;
    return (
      <div className={`rounded-2xl border ${BORDER.default} ${BG.surface} py-16 text-center shadow`}>
        <p className={TEXT.muted}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-2xl border ${BORDER.default} ${BG.surface} shadow-lg`}>
      <table className="w-full min-w-0 md:min-w-[480px] lg:min-w-[640px]">
        <thead>
          <tr className={`border-b ${BORDER.default} ${BG.muted}`}>
            <th className={`hidden w-24 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted} md:table-cell`}>
              شماره
            </th>
            <th className={`min-w-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted}`}>
              عنوان
            </th>
            {isAdmin && (
              <th className={`hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted} lg:table-cell`}>
                کاربر
              </th>
            )}
            <th className={`min-w-[150px] shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted}`}>
              وضعیت
            </th>
            <th className={`hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted} md:table-cell`}>
              اولویت
            </th>
            <th className={`hidden w-24 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted} sm:table-cell`}>
              ایجاد
            </th>
            <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${TEXT.muted}`}>
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              className={`border-b ${BORDER.divider} transition-colors last:border-0 ${BG.rowHover}`}
            >
              <td className="hidden w-24 shrink-0 px-4 py-3 md:table-cell">
                {t.ticket_number ? (
                  <CopyableTicketNumber ticketNumber={t.ticket_number} />
                ) : (
                  <span className={`text-sm tabular-nums ${TEXT.muted}`}>—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/ticket/${t.id}`}
                  className={`max-w-[150px] truncate font-medium ${TEXT.heading} no-underline hover:text-primary sm:max-w-[200px] md:max-w-[240px]`}
                  title={t.title}
                >
                  {t.title}
                </Link>
                <p
                  className={`mt-0.5 hidden max-w-[150px] truncate text-xs ${TEXT.subtle} sm:block md:max-w-[240px]`}
                  title={t.description}
                >
                  {t.description}
                </p>
              </td>
              {isAdmin && (
                <td className={`hidden px-4 py-3 text-sm ${TEXT.label} lg:table-cell`}>
                  {getDisplayName(t.user)}
                </td>
              )}
              <td className="min-w-[150px] shrink-0 px-4 py-3">
                {isAdmin && onStatusChange ? (
                  <div className="min-w-[130px]">
                    <Select
                      value={t.status}
                      onChange={(e: { target: { value: string } }) => onStatusChange(t.id, e.target.value)}
                      options={STATUS_OPTIONS}
                      size="small"
                    />
                  </div>
                ) : (
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR_CLASS[t.status] || BG.fallback}`}
                  >
                    {getStatusLabel(t.status)}
                  </span>
                )}
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <span className={`inline-flex items-center gap-2 text-sm ${TEXT.muted}`}>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${(PRIORITY_DOT_CLASS as Record<string, string>)[t.priority] ?? 'bg-slate-400'}`}
                    aria-hidden
                  />
                  {getPriorityLabel(t.priority)}
                </span>
              </td>
              <td className={`hidden w-24 shrink-0 whitespace-nowrap px-4 py-3 text-xs ${TEXT.subtle} sm:table-cell`}>
                {isAdmin ? formatDateOnly(t.created_at) : formatDateTime(t.created_at)}
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
  );
}
