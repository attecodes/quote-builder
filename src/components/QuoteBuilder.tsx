"use client";

import { useMemo, useState } from "react";
import { deckReboard } from "@/domain/assemblies/deckReboard";
import { handrailOptions } from "@/domain/assemblies/handrail";
import { stairTreads } from "@/domain/assemblies/stairTreads";
import { dollars } from "@/domain/money";
import { DEFAULT_PRICE_BOOK, type DeckMaterial } from "@/domain/priceBook";
import { totalsWithSelections } from "@/domain/totals";
import type { Quote } from "@/domain/types";
import { LineItemTable } from "./LineItemTable";
import { NumberField } from "./NumberField";
import { OptionPicker } from "./OptionPicker";
import { QuoteSummary } from "./QuoteSummary";

const card = "flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4";

function useQuote() {
  const [laborRate, setLaborRate] = useState(75);
  const [areaSqFt, setAreaSqFt] = useState(200);
  const [material, setMaterial] = useState<DeckMaterial>("pressure-treated");
  const [joistsToRepair, setJoists] = useState(0);
  const [railFt, setRailFt] = useState(12);
  const [treads, setTreads] = useState(0);

  const quote = useMemo<Quote>(() => {
    const settings = { laborRate: dollars(laborRate), materialMarkup: 0.15 };
    return {
      title: "Deck and stair rail",
      settings,
      sections: [
        deckReboard({ areaSqFt, material, joistsToRepair }, DEFAULT_PRICE_BOOK, settings),
        ...(treads > 0 ? [stairTreads({ treadCount: treads }, DEFAULT_PRICE_BOOK, settings)] : []),
      ],
      optionGroups: railFt > 0 ? [handrailOptions({ runLengthFt: railFt }, DEFAULT_PRICE_BOOK, settings)] : [],
    };
  }, [laborRate, areaSqFt, material, joistsToRepair, railFt, treads]);

  const inputs = { laborRate, areaSqFt, material, joistsToRepair, railFt, treads };
  const setters = { setLaborRate, setAreaSqFt, setMaterial, setJoists, setRailFt, setTreads };
  return { quote, inputs, setters };
}

export function QuoteBuilder() {
  const { quote, inputs, setters } = useQuote();
  const [selections, setSelections] = useState<Record<string, string>>({ handrail: "wood" });
  const totals = totalsWithSelections(quote, selections);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Quote Builder</h1>

      <section className={card}>
        <h2 className="font-semibold">Measurements</h2>
        <NumberField label="Labor rate" suffix="$/hr" testId="labor-rate" value={inputs.laborRate} onChange={setters.setLaborRate} />
        <NumberField label="Deck area" suffix="sq ft" testId="deck-area" value={inputs.areaSqFt} onChange={setters.setAreaSqFt} />
        <NumberField label="Joists to sister / reframe" testId="deck-joists" value={inputs.joistsToRepair} onChange={setters.setJoists} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">Deck board material</span>
          <select
            data-testid="deck-material"
            value={inputs.material}
            onChange={(e) => setters.setMaterial(e.target.value as DeckMaterial)}
            className="rounded-md border border-stone-300 px-3 py-2 text-base"
          >
            <option value="pressure-treated">Pressure-treated</option>
            <option value="composite">Composite</option>
          </select>
        </label>
        <NumberField label="Stair handrail run" suffix="ft" testId="rail-length" value={inputs.railFt} onChange={setters.setRailFt} />
        <NumberField label="Oak stair treads" suffix="treads" testId="stair-treads" value={inputs.treads} onChange={setters.setTreads} />
      </section>

      {quote.sections.map((section) => (
        <section key={section.id} className={card}>
          <h2 className="font-semibold">{section.title}</h2>
          <LineItemTable items={section.items} settings={quote.settings} />
        </section>
      ))}

      {quote.optionGroups.map((group) => (
        <section key={group.id} className={card}>
          <OptionPicker
            group={group}
            settings={quote.settings}
            selectedId={selections[group.id]}
            onSelect={(id) => setSelections((s) => ({ ...s, [group.id]: id }))}
          />
        </section>
      ))}

      <QuoteSummary totals={totals} />
    </div>
  );
}
