import { describe, expect, it } from "vitest";
import { stairTreads } from "./assemblies/stairTreads";
import { dollars } from "./money";
import { DEFAULT_PRICE_BOOK } from "./priceBook";
import { baseTotals } from "./totals";
import type { Quote, QuoteSettings } from "./types";

const settings: QuoteSettings = { laborRate: dollars(75), materialMarkup: 0.15 };
const totalFor = (treadCount: number) => {
  const section = stairTreads({ treadCount }, DEFAULT_PRICE_BOOK, settings);
  const quote: Quote = { title: "t", settings, sections: [section], optionGroups: [] };
  return baseTotals(quote).total;
};

describe("stair treads", () => {
  it("prices one oak tread per tread and includes demo", () => {
    const section = stairTreads({ treadCount: 12 }, DEFAULT_PRICE_BOOK, settings);
    expect(section.items.find((i) => i.id === "stairs-treads")?.quantity).toBe(12);
    expect(section.items.find((i) => i.id === "stairs-demo")?.quantity).toBe(3);
  });

  it("rounds demo and install hours up to the quarter hour", () => {
    const section = stairTreads({ treadCount: 1 }, DEFAULT_PRICE_BOOK, settings);
    expect(section.items.find((i) => i.id === "stairs-demo")?.quantity).toBe(0.25);
    expect(section.items.find((i) => i.id === "stairs-install")?.quantity).toBe(0.5);
  });

  it("costs nothing for zero treads and more as treads are added", () => {
    expect(totalFor(0)).toBe(0);
    expect(totalFor(13)).toBeGreaterThan(totalFor(12));
  });
});
