export function TicketListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200/60" />
      ))}
    </div>
  );
}
