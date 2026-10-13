import { describe, expect, it } from "vitest";
import { deckLinearFeet, deckReboard } from "./assemblies/deckReboard";
import { handrailOptions, postCount } from "./assemblies/handrail";
import { dollars, roundHours } from "./money";
import { DEFAULT_PRICE_BOOK } from "./priceBook";
import { baseTotals, lineCost, totalsWithSelections } from "./totals";
import type { Quote, QuoteSettings } from "./types";

const settings: QuoteSettings = { laborRate: dollars(75), materialMarkup: 0.15 };

describe("money math", () => {
  it("rounds hours up to the quarter hour", () => {
    expect(roundHours(1.01)).toBe(1.25);
    expect(roundHours(2)).toBe(2);
  });

  it("marks up materials but not labor or fees", () => {
    const material = { id: "m", label: "m", kind: "material" as const, quantity: 2, unit: "ea", unitCost: dollars(10) };
    const fee = { ...material, kind: "fee" as const };
    expect(lineCost(material, settings)).toBe(dollars(23));
    expect(lineCost(fee, settings)).toBe(dollars(20));
  });
});

describe("deck re-board", () => {
  it("converts square feet to linear feet of 5.5in boards with waste", () => {
    // 100 sq ft / (5.625in / 12) = 213.3 lf, +10% waste = 234.7 -> 235
    expect(deckLinearFeet(100, 5.5, 0.1)).toBe(235);
  });

  it("charges at least one dump load and skips reframing when no joists are bad", () => {
    const section = deckReboard({ areaSqFt: 100, material: "pressure-treated", joistsToRepair: 0 }, DEFAULT_PRICE_BOOK, settings);
    const ids = section.items.map((i) => i.id);
    expect(ids).toContain("deck-dump");
    expect(ids).not.toContain("deck-reframe");
    expect(section.items.find((i) => i.id === "deck-dump")?.quantity).toBe(1);
  });

  it("costs more in composite than pressure-treated", () => {
    const pt = deckReboard({ areaSqFt: 300, material: "pressure-treated", joistsToRepair: 2 }, DEFAULT_PRICE_BOOK, settings);
    const comp = deckReboard({ areaSqFt: 300, material: "composite", joistsToRepair: 2 }, DEFAULT_PRICE_BOOK, settings);
    const quote = (s: typeof pt): Quote => ({ title: "t", settings, sections: [s], optionGroups: [] });
    expect(baseTotals(quote(comp)).total).toBeGreaterThan(baseTotals(quote(pt)).total);
  });
});

describe("handrail options", () => {
  it("places a post at each end and no more than 6ft apart", () => {
    expect(postCount(12, 6)).toBe(3);
    expect(postCount(13, 6)).toBe(4);
  });

  it("adds only the selected option to the total", () => {
    const group = handrailOptions({ runLengthFt: 12 }, DEFAULT_PRICE_BOOK, settings);
    const quote: Quote = { title: "t", settings, sections: [], optionGroups: [group] };
    const wood = totalsWithSelections(quote, { handrail: "wood" }).total;
    const glass = totalsWithSelections(quote, { handrail: "glass" }).total;
    expect(glass).toBeGreaterThan(wood);
    expect(totalsWithSelections(quote, {}).total).toBe(0);
  });
});
