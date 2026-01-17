import { SystemData, AuthorityLevel } from './types';

export const TERRAX_SYSTEM: SystemData = {
    star: {
        name: 'Sol (Host)',
        type: 'G0.7V',
        massKg: 2.06856E+30,
        radiusKm: 712083,
        temperatureK: 5940,
        color: '#fff4ea',
        ageGyr: 4.3,
        luminosity: 1.170,
        albedo: 0 // Stars emit light
    },
    planet: {
        name: 'Terrax',
        radiusKm: 7016.80,
        massKg: 8.53996E+24,
        color: '#45a29e', // Speculative based on atmosphere
        textureUrl: 'https://images.unsplash.com/photo-1614730375473-078472a8851c?ixlib=rb-4.0.3&auto=format&fit=crop&w=748&q=80',
        albedo: 0.30, // Earth-like average
        semiMajorAxisAU: 1.34,
        rotationPeriodHours: 26,
        orbitalPeriodLocalDays: 512.833,
        axialTilt: 25,
        gravityG: 1.179,
        atmosphere: {
            pressureAtm: 1.36,
            composition: [
                { gas: 'N2', percent: 76.97 },
                { gas: 'O2', percent: 22.0 },
                { gas: 'Ar', percent: 0.93 },
                { gas: 'CO2', percent: 0.1 },
            ]
        }
    },
    neighbors: [
        {
            name: 'Pyroeis (Mercury-A)',
            radiusKm: 2439,
            color: '#a1a1aa',
            albedo: 0.148,
            semiMajorAxisAU: 0.39,
            orbitalPeriodDays: 88,
            type: 'Rocky'
        },
        {
            name: 'Cytherea (Venus-A)',
            radiusKm: 6051,
            color: '#fbbf24',
            albedo: 0.631,
            semiMajorAxisAU: 0.72,
            orbitalPeriodDays: 225,
            type: 'Rocky'
        },
        // Terrax is here at 1.34 AU
        {
            name: 'Areus (Mars-A)',
            radiusKm: 3389,
            color: '#ef4444',
            albedo: 0.158,
            semiMajorAxisAU: 1.88, // Adjusted for Terrax gap
            orbitalPeriodDays: 687,
            type: 'Rocky'
        },
        {
            name: 'Jove (Jupiter-A)',
            radiusKm: 69911,
            color: '#d97706',
            albedo: 0.487,
            semiMajorAxisAU: 5.2,
            orbitalPeriodDays: 4333,
            type: 'Gas Giant'
        },
        {
            name: 'Saturnus (Saturn-A)',
            radiusKm: 58232,
            color: '#fde047',
            albedo: 0.521,
            semiMajorAxisAU: 9.5,
            orbitalPeriodDays: 10759,
            type: 'Gas Giant'
        },
        {
            name: 'Neptunus (Neptune-A)',
            radiusKm: 24622,
            color: '#3b82f6',
            albedo: 0.422,
            semiMajorAxisAU: 30.1,
            orbitalPeriodDays: 60190,
            type: 'Ice Giant'
        }
    ],
    moons: [
        {
            name: 'Luna',
            radiusKm: 2415.20,
            massKg: 2.205E+23,
            color: '#e0e0e0',
            albedo: 0.12,
            semiMajorAxisKm: 556200,
            orbitalPeriodDays: 39.213, // Synodic
            radiusRelative: 1.0,
            isLocked: true,
            eccentricity: 0.055,
            periapsisArgument: -45
        },
        {
            name: 'Echo',
            radiusKm: 888.18,
            massKg: 9.555E+21,
            color: '#a3a3a3',
            albedo: 0.09,
            // Adjusted semi-major axis to obey Kepler's 3rd Law relative to Luna
            // (72.79/39.213)^2 = (a/556200)^3 => a approx 839,800 km
            semiMajorAxisKm: 839800, 
            orbitalPeriodDays: 72.79, // Synodic from YAML
            radiusRelative: 0.24,
            isLocked: true,
            eccentricity: 0.12,
            periapsisArgument: 135
        }
    ],
    calendar: {
        months: Array.from({ length: 13 }, (_, i) => {
            const num = i + 1;
            // 4, 8, 13 are long months (40 days)
            const isLong = [4, 8, 13].includes(num);
            return {
                id: num,
                name: `Month ${num}`,
                days: isLong ? 40 : 39,
                isLong
            };
        }),
        remainderDays: 3, // Normal year has 3 remainder days
        leapYearRemainder: 2, // Leap year has 2 remainder days
        leapYearInterval: 6,
    }
};

export const METADATA = {
    authority: AuthorityLevel.Soft,
    status: 'Incomplete',
    canonLevel: 'Primary'
};