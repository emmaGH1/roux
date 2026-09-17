/** Pulsing OPEN NOW / CLOSED badge. Server-safe; the pulse is pure CSS. */
export function OpenNowBadge({ open }: { open: boolean }) {
  if (!open) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-medium text-[var(--gray)]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--gray)]" />
        CLOSED RIGHT NOW
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[11px] font-medium text-[#15803D]">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
      </span>
      OPEN NOW
    </span>
  );
}
