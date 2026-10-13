"use client";

import { formatCents } from "@/domain/money";
import { sumItems } from "@/domain/totals";
import type { OptionGroup, QuoteSettings } from "@/domain/types";

interface Props {
  group: OptionGroup;
  settings: QuoteSettings;
  selectedId: string | undefined;
  onSelect: (optionId: string) => void;
}

export function OptionPicker({ group, settings, selectedId, onSelect }: Props) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-semibold">{group.title}</legend>
      {group.options.map((option) => (
        <label
          key={option.id}
          className="flex cursor-pointer items-center justify-between rounded-md border border-stone-300 px-3 py-2 has-[:checked]:border-amber-700 has-[:checked]:bg-amber-50"
        >
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name={group.id}
              data-testid={`option-${group.id}-${option.id}`}
              checked={selectedId === option.id}
              onChange={() => onSelect(option.id)}
            />
            {option.label}
          </span>
          <span className="tabular-nums">{formatCents(sumItems(option.items, settings).total)}</span>
        </label>
      ))}
    </fieldset>
  );
}
