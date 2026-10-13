import type { Cents } from "./types";

export function dollars(amount: number): Cents {
  return Math.round(amount * 100);
}

export function formatCents(cents: Cents): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/** Round hours up to the nearest quarter hour, the way time gets billed in the field. */
export function roundHours(hours: number): number {
  return Math.ceil(hours * 4) / 4;
}
