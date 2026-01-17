import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface PlanetaryOrreryProps {
    currentDay: number;
}

export const PlanetaryOrrery: React.FC<PlanetaryOrreryProps> = ({ currentDay }) => {
    // Canvas size
    const SIZE = 300;
    const CENTER = SIZE / 2;
    
    // Scale factors for visualization (not to scale distance, but to scale relative motion)
    const ORBIT_LUNA = 80;
    const ORBIT_ECHO = 120; // Echo is actually closer in real physics usually if faster, but text says Echo Period > Luna Period? 
    // Wait, check YAML: Echo Semi-Major 69.06 km (Wait, 69km? Must be 69,060 or text error. YAML says 69.06 *km* which is inside the planet. 
    // However, Moon Zone Inner is 20k km. I will assume specific value 69,060 or similar.
    // Actually, look at Period. Luna: 39 days. Echo: 72 days.
    // Kepler's 3rd Law: T^2 proportional to a^3. Higher period = Higher semi-major axis.
    // So Echo MUST be further out than Luna. 
    // Visualization: Luna inner, Echo outer.

    // Calculate angles in radians based on period
    const getAngle = (period: number, day: number) => {
        // -90 degrees to start at top
        return ((day % period) / period) * 2 * Math.PI - (Math.PI / 2);
    };

    const lunaAngle = getAngle(TERRAX_SYSTEM.moons[0].orbitalPeriodDays, currentDay);
    const echoAngle = getAngle(TERRAX_SYSTEM.moons[1].orbitalPeriodDays, currentDay);

    // Positions
    const lunaX = CENTER + Math.cos(lunaAngle) * ORBIT_LUNA;
    const lunaY = CENTER + Math.sin(lunaAngle) * ORBIT_LUNA;

    const echoX = CENTER + Math.cos(echoAngle) * ORBIT_ECHO;
    const echoY = CENTER + Math.sin(echoAngle) * ORBIT_ECHO;

    // Check Alignment (Conjunction)
    // Alignment happens when the difference between angles is 0 (or multiple of 2PI)
    // We visualize this simply by the positions.

    return (
        <div className="flex flex-col items-center">
             <div className="relative" style={{ width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} className="overflow-visible">
                    {/* Orbits */}
                    <circle cx={CENTER} cy={CENTER} r={ORBIT_LUNA} fill="none" stroke="#334155" strokeDasharray="4 4" />
                    <circle cx={CENTER} cy={CENTER} r={ORBIT_ECHO} fill="none" stroke="#334155" strokeDasharray="4 4" />

                    {/* Planet Terrax */}
                    <circle cx={CENTER} cy={CENTER} r={25} fill="#45a29e" filter="drop-shadow(0 0 10px rgba(69, 162, 158, 0.5))" />
                    <text x={CENTER} y={CENTER + 5} textAnchor="middle" fill="#0b0c10" fontSize="10" fontWeight="bold">TERRAX</text>

                    {/* Moon Luna */}
                    <circle cx={lunaX} cy={lunaY} r={12} fill="#e2e8f0" />
                    <text x={lunaX} y={lunaY - 16} textAnchor="middle" fill="#94a3b8" fontSize="10">Luna</text>

                    {/* Moon Echo */}
                    <circle cx={echoX} cy={echoY} r={8} fill="#94a3b8" />
                    <text x={echoX} y={echoY - 12} textAnchor="middle" fill="#64748b" fontSize="10">Echo</text>

                    {/* Sun Direction Indicator (Simplified) */}
                    <path d={`M ${CENTER - 40} ${SIZE + 20} L ${CENTER + 40} ${SIZE + 20} L ${CENTER} ${SIZE + 10} Z`} fill="#fcd34d" opacity="0.5" />
                    <text x={CENTER} y={SIZE + 35} textAnchor="middle" fill="#fcd34d" fontSize="10">TO SOL</text>
                </svg>
             </div>
             <div className="mt-4 text-center text-sm text-slate-400">
                <p>Orbital Configuration</p>
                <p className="text-xs text-slate-600">Top-down view (Not to scale)</p>
             </div>
        </div>
    );
};