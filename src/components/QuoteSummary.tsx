import { formatCents } from "@/domain/money";
import type { Totals } from "@/domain/totals";

export function QuoteSummary({ totals }: { totals: Totals }) {
  const rows: [string, number][] = [
    ["Labor", totals.labor],
    ["Materials", totals.materials],
    ["Fees", totals.fees],
  ];
  return (
    <div className="rounded-lg bg-stone-900 p-4 text-stone-50">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between text-sm text-stone-300">
          <span>{label}</span>
          <span className="tabular-nums">{formatCents(value)}</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-stone-700 pt-2 text-xl font-semibold">
        <span>Total</span>
        <span className="tabular-nums" data-testid="quote-total">
          {formatCents(totals.total)}
        </span>
      </div>
    </div>
  );
}
