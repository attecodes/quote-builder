import { formatCents } from "@/domain/money";
import { lineCost } from "@/domain/totals";
import type { LineItem, QuoteSettings } from "@/domain/types";

interface Props {
  items: LineItem[];
  settings: QuoteSettings;
}

export function LineItemTable({ items, settings }: Props) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-stone-100">
            <td className="py-1.5">{item.label}</td>
            <td className="py-1.5 text-right text-stone-500 whitespace-nowrap">
              {item.quantity} {item.unit}
            </td>
            <td className="py-1.5 pl-3 text-right tabular-nums">{formatCents(lineCost(item, settings))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
