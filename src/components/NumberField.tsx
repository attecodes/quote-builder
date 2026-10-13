"use client";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  testId: string;
  suffix?: string;
}

export function NumberField({ label, value, onChange, testId, suffix }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-stone-700">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          data-testid={testId}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-base"
        />
        {suffix && <span className="text-stone-500">{suffix}</span>}
      </span>
    </label>
  );
}
