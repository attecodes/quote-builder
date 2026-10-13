import type { PriceBook } from "../priceBook";
import type { QuoteSettings, Section } from "../types";
import { labor } from "./labor";

export interface StairTreadsInput {
  treadCount: number;
}

export function stairTreads(input: StairTreadsInput, book: PriceBook, settings: QuoteSettings): Section {
  const n = Math.max(0, Math.floor(input.treadCount));
  const stairs = book.stairs;
  return {
    id: "stair-treads",
    title: `Oak stair treads (${n})`,
    items: [
      labor("stairs-demo", "Demo existing treads", n * stairs.demoHoursPerTread, settings),
      { id: "stairs-treads", label: "Oak treads", kind: "material", quantity: n, unit: "ea", unitCost: stairs.oakTreadPrice },
      { id: "stairs-adhesive", label: "Tread adhesive and fasteners", kind: "material", quantity: n, unit: "ea", unitCost: stairs.adhesiveAndFastenersPerTread },
      labor("stairs-install", "Install oak treads", n * stairs.installHoursPerTread, settings),
    ],
  };
}
