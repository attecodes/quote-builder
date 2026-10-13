import type { Cents, LineItem, Quote, QuoteSettings } from "./types";

export interface Totals {
  labor: Cents;
  materials: Cents;
  fees: Cents;
  total: Cents;
}

const EMPTY: Totals = { labor: 0, materials: 0, fees: 0, total: 0 };

export function lineCost(item: LineItem, settings: QuoteSettings): Cents {
  const raw = item.quantity * item.unitCost;
  const marked = item.kind === "material" ? raw * (1 + settings.materialMarkup) : raw;
  return Math.round(marked);
}

export function sumItems(items: LineItem[], settings: QuoteSettings): Totals {
  return items.reduce<Totals>((acc, item) => {
    const cost = lineCost(item, settings);
    const bucket = item.kind === "labor" ? "labor" : item.kind === "material" ? "materials" : "fees";
    return { ...acc, [bucket]: acc[bucket] + cost, total: acc.total + cost };
  }, EMPTY);
}

function addTotals(a: Totals, b: Totals): Totals {
  return {
    labor: a.labor + b.labor,
    materials: a.materials + b.materials,
    fees: a.fees + b.fees,
    total: a.total + b.total,
  };
}

/** Base scope of work, without any client-selected options. */
export function baseTotals(quote: Quote): Totals {
  return quote.sections
    .map((section) => sumItems(section.items, quote.settings))
    .reduce(addTotals, EMPTY);
}

/** Total with the client's choice in each option group (groupId -> optionId). */
export function totalsWithSelections(quote: Quote, selections: Record<string, string>): Totals {
  const chosen = quote.optionGroups.flatMap((group) => {
    const option = group.options.find((o) => o.id === selections[group.id]);
    return option ? option.items : [];
  });
  return addTotals(baseTotals(quote), sumItems(chosen, quote.settings));
}
