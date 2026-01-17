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
    },
    planet: {
        name: 'Terrax',
        radiusKm: 7016.80,
        massKg: 8.53996E+24,
        color: '#45a29e', // Speculative based on atmosphere
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
    moons: [
        {
            name: 'Luna',
            radiusKm: 2415.20,
            massKg: 2.205E+23,
            color: '#e0e0e0',
            semiMajorAxisKm: 556200,
            orbitalPeriodDays: 39.213, // Synodic
            radiusRelative: 1.0,
            isLocked: true,
        },
        {
            name: 'Echo',
            radiusKm: 888.18,
            massKg: 9.555E+21,
            color: '#a3a3a3',
            semiMajorAxisKm: 69060, // Note: This seems very close based on text, but using provided YAML
            orbitalPeriodDays: 72.79, // Synodic from YAML
            radiusRelative: 0.24,
            isLocked: true,
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