/** All money is stored as whole cents (integers) to avoid floating-point errors. */
export type Cents = number;

type LineItemKind = "labor" | "material" | "fee";

export interface LineItem {
  id: string;
  label: string;
  kind: LineItemKind;
  /** Hours for labor, count/feet for material, 1 for a flat fee. */
  quantity: number;
  unit: string;
  /** Hourly rate for labor, unit price for material, flat amount for a fee. */
  unitCost: Cents;
}

export interface Section {
  id: string;
  title: string;
  items: LineItem[];
}

/** A choice the client makes, e.g. wood vs. glass vs. cable handrail. */
export interface QuoteOption {
  id: string;
  label: string;
  items: LineItem[];
}

export interface OptionGroup {
  id: string;
  title: string;
  options: QuoteOption[];
}

export interface QuoteSettings {
  laborRate: Cents;
  /** Markup applied to materials only, e.g. 0.15 for 15%. */
  materialMarkup: number;
}

export interface Quote {
  title: string;
  settings: QuoteSettings;
  sections: Section[];
  optionGroups: OptionGroup[];
}
