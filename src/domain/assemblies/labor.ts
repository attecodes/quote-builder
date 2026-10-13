import { roundHours } from "../money";
import type { LineItem, QuoteSettings } from "../types";

export function labor(id: string, label: string, hours: number, settings: QuoteSettings): LineItem {
  return { id, label, kind: "labor", quantity: roundHours(hours), unit: "hr", unitCost: settings.laborRate };
}
