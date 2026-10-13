import { dollars } from "./money";
import type { Cents } from "./types";

/**
 * PLACEHOLDER numbers. Replace with your real supplier pricing and the
 * production rates you actually hit in the field. Everything in the app
 * reads from here, so this is the one file to tune.
 */
export interface PriceBook {
  deck: {
    boardPricePerLinearFt: Record<DeckMaterial, Cents>;
    screwsPerSqFt: number;
    screwBoxCount: number;
    screwBoxPrice: Cents;
    joistSisterLumber: Cents;
    joistHangerAndFasteners: Cents;
    /** Production rates, in square feet per hour. */
    demoSqFtPerHour: number;
    installSqFtPerHour: number;
    haulSqFtPerHour: number;
    hoursPerJoistSister: number;
    dumpFeePerLoad: Cents;
    sqFtPerDumpLoad: number;
    wasteFactor: number;
  };
  handrail: Record<RailStyle, RailPricing>;
  stairs: {
    oakTreadPrice: Cents;
    adhesiveAndFastenersPerTread: Cents;
    demoHoursPerTread: number;
    installHoursPerTread: number;
  };
}

export type DeckMaterial = "pressure-treated" | "composite";
export type RailStyle = "wood" | "glass" | "cable" | "plexi";

interface RailPricing {
  label: string;
  materialPerLinearFt: Cents;
  materialPerPost: Cents;
  installHoursPerLinearFt: number;
  installHoursPerPost: number;
}

export const DEFAULT_PRICE_BOOK: PriceBook = {
  deck: {
    boardPricePerLinearFt: {
      "pressure-treated": dollars(1.6),
      composite: dollars(4.5),
    },
    screwsPerSqFt: 3.5,
    screwBoxCount: 350,
    screwBoxPrice: dollars(45),
    joistSisterLumber: dollars(28),
    joistHangerAndFasteners: dollars(9),
    demoSqFtPerHour: 40,
    installSqFtPerHour: 15,
    haulSqFtPerHour: 80,
    hoursPerJoistSister: 0.75,
    dumpFeePerLoad: dollars(95),
    sqFtPerDumpLoad: 300,
    wasteFactor: 0.1,
  },
  stairs: {
    oakTreadPrice: dollars(48),
    adhesiveAndFastenersPerTread: dollars(4),
    demoHoursPerTread: 0.25,
    installHoursPerTread: 0.5,
  },
  handrail: {
    wood: {
      label: "Wood rail and balusters",
      materialPerLinearFt: dollars(18),
      materialPerPost: dollars(40),
      installHoursPerLinearFt: 0.45,
      installHoursPerPost: 0.75,
    },
    cable: {
      label: "Cable rail",
      materialPerLinearFt: dollars(45),
      materialPerPost: dollars(110),
      installHoursPerLinearFt: 0.6,
      installHoursPerPost: 1,
    },
    plexi: {
      label: "Plexi (acrylic) panels",
      materialPerLinearFt: dollars(55),
      materialPerPost: dollars(60),
      installHoursPerLinearFt: 0.5,
      installHoursPerPost: 0.75,
    },
    glass: {
      label: "Tempered glass panels",
      materialPerLinearFt: dollars(120),
      materialPerPost: dollars(90),
      installHoursPerLinearFt: 0.7,
      installHoursPerPost: 1,
    },
  },
};
