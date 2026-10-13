import { roundHours } from "../money";
import type { PriceBook, RailStyle } from "../priceBook";
import type { OptionGroup, QuoteOption, QuoteSettings } from "../types";

export interface HandrailInput {
  runLengthFt: number;
  /** Max spacing between posts, in feet. */
  maxPostSpacingFt?: number;
}

const STYLES: RailStyle[] = ["wood", "cable", "plexi", "glass"];

export function postCount(runLengthFt: number, maxSpacingFt: number): number {
  return Math.ceil(runLengthFt / maxSpacingFt) + 1;
}

function railOption(style: RailStyle, input: HandrailInput, book: PriceBook, settings: QuoteSettings): QuoteOption {
  const p = book.handrail[style];
  const posts = postCount(input.runLengthFt, input.maxPostSpacingFt ?? 6);
  const hours = input.runLengthFt * p.installHoursPerLinearFt + posts * p.installHoursPerPost;
  return {
    id: style,
    label: p.label,
    items: [
      { id: `rail-${style}-run`, label: `${p.label} materials`, kind: "material", quantity: input.runLengthFt, unit: "lf", unitCost: p.materialPerLinearFt },
      { id: `rail-${style}-posts`, label: "Posts and mounting hardware", kind: "material", quantity: posts, unit: "ea", unitCost: p.materialPerPost },
      { id: `rail-${style}-labor`, label: "Build and install handrail", kind: "labor", quantity: roundHours(hours), unit: "hr", unitCost: settings.laborRate },
    ],
  };
}

export function handrailOptions(input: HandrailInput, book: PriceBook, settings: QuoteSettings): OptionGroup {
  return {
    id: "handrail",
    title: `Stair handrail (${input.runLengthFt} ft)`,
    options: STYLES.map((style) => railOption(style, input, book, settings)),
  };
}
