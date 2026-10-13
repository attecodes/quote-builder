import { roundHours } from "../money";
import type { DeckMaterial, PriceBook } from "../priceBook";
import type { LineItem, QuoteSettings, Section } from "../types";

export interface DeckReboardInput {
  areaSqFt: number;
  material: DeckMaterial;
  /** Joists that need sistering / reframing. */
  joistsToRepair: number;
  /** Board face width in inches (5.5 for 5/4x6). */
  boardWidthIn?: number;
}

/** Gap between boards in inches. */
const BOARD_GAP_IN = 0.125;

export function deckLinearFeet(areaSqFt: number, boardWidthIn: number, wasteFactor: number): number {
  const coveragePerLinearFt = (boardWidthIn + BOARD_GAP_IN) / 12;
  return Math.ceil((areaSqFt / coveragePerLinearFt) * (1 + wasteFactor));
}

function labor(id: string, label: string, hours: number, settings: QuoteSettings): LineItem {
  return { id, label, kind: "labor", quantity: roundHours(hours), unit: "hr", unitCost: settings.laborRate };
}

function demoAndHaul(input: DeckReboardInput, book: PriceBook["deck"], settings: QuoteSettings): LineItem[] {
  const loads = Math.max(1, Math.ceil(input.areaSqFt / book.sqFtPerDumpLoad));
  return [
    labor("deck-demo", "Demo existing deck boards", input.areaSqFt / book.demoSqFtPerHour, settings),
    labor("deck-haul", "Haul debris to truck / front", input.areaSqFt / book.haulSqFtPerHour, settings),
    { id: "deck-dump", label: "Dump fee", kind: "fee", quantity: loads, unit: "load", unitCost: book.dumpFeePerLoad },
  ];
}

function reframing(input: DeckReboardInput, book: PriceBook["deck"], settings: QuoteSettings): LineItem[] {
  if (input.joistsToRepair <= 0) return [];
  const n = input.joistsToRepair;
  return [
    labor("deck-reframe", `Sister / reframe ${n} joist(s)`, n * book.hoursPerJoistSister, settings),
    { id: "deck-reframe-lumber", label: "Joist lumber", kind: "material", quantity: n, unit: "ea", unitCost: book.joistSisterLumber },
    { id: "deck-reframe-hw", label: "Hangers and structural fasteners", kind: "material", quantity: n, unit: "ea", unitCost: book.joistHangerAndFasteners },
  ];
}

function boardsAndInstall(input: DeckReboardInput, book: PriceBook["deck"], settings: QuoteSettings): LineItem[] {
  const linearFt = deckLinearFeet(input.areaSqFt, input.boardWidthIn ?? 5.5, book.wasteFactor);
  const screwBoxes = Math.ceil((input.areaSqFt * book.screwsPerSqFt) / book.screwBoxCount);
  const boardLabel = input.material === "composite" ? "Composite deck boards" : "Pressure-treated deck boards";
  return [
    { id: "deck-boards", label: boardLabel, kind: "material", quantity: linearFt, unit: "lf", unitCost: book.boardPricePerLinearFt[input.material] },
    { id: "deck-screws", label: "Deck screws", kind: "material", quantity: screwBoxes, unit: "box", unitCost: book.screwBoxPrice },
    labor("deck-install", "Install new deck boards", input.areaSqFt / book.installSqFtPerHour, settings),
  ];
}

export function deckReboard(input: DeckReboardInput, book: PriceBook, settings: QuoteSettings): Section {
  return {
    id: "deck-reboard",
    title: `Deck re-board (${input.areaSqFt} sq ft)`,
    items: [
      ...demoAndHaul(input, book.deck, settings),
      ...reframing(input, book.deck, settings),
      ...boardsAndInstall(input, book.deck, settings),
    ],
  };
}
