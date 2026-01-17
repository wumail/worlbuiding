export enum AuthorityLevel {
    Hard = 'hard',
    Soft = 'soft',
    Speculative = 'speculative'
}

export interface CelestialBody {
    name: string;
    radiusKm: number;
    massKg?: number;
    color: string;
}

export interface Star extends CelestialBody {
    type: string;
    temperatureK: number;
    ageGyr: number;
    luminosity: number; // relative to Sol
}

export interface Planet extends CelestialBody {
    semiMajorAxisAU: number;
    rotationPeriodHours: number;
    orbitalPeriodLocalDays: number;
    axialTilt: number;
    gravityG: number;
    atmosphere: {
        pressureAtm: number;
        composition: { gas: string; percent: number }[];
    };
}

export interface Moon extends CelestialBody {
    semiMajorAxisKm: number;
    orbitalPeriodDays: number; // Synodic
    radiusRelative: number; // Relative to Luna
    isLocked: boolean;
}

export interface CalendarMonth {
    id: number;
    name: string;
    days: number;
    isLong: boolean; // True if 40 days
}

export interface SystemData {
    star: Star;
    planet: Planet;
    moons: Moon[];
    calendar: {
        months: CalendarMonth[];
        remainderDays: number;
        leapYearRemainder: number;
        leapYearInterval: number;
    };
}