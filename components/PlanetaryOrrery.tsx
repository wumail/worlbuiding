import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface PlanetaryOrreryProps {
    currentDay: number;
}

export const PlanetaryOrrery: React.FC<PlanetaryOrreryProps> = ({ currentDay }) => {
    // Canvas size
    const SIZE = 300;
    const CENTER = SIZE / 2;
    
    // Scale factors for visualization
    const SCALE_FACTOR = 80 / TERRAX_SYSTEM.moons[0].semiMajorAxisKm; // Normalize Luna to ~80px

    // Kepler Solver Approximation (Mean Anomaly -> Eccentric Anomaly)
    const solveKepler = (M: number, e: number): number => {
        let E = M;
        // 3 iterations is usually sufficient for low eccentricity visualization
        for (let i = 0; i < 4; i++) {
            E = M + e * Math.sin(E);
        }
        return E;
    };

    const getPosition = (
        semiMajorKm: number, 
        periodDays: number, 
        eccentricity: number, 
        periapsisDeg: number,
        day: number
    ) => {
        // Mean Anomaly (M)
        const M = (day / periodDays) * 2 * Math.PI;
        
        // Eccentric Anomaly (E)
        const E = solveKepler(M, eccentricity);
        
        // Semi-major axis in pixels
        const a = semiMajorKm * SCALE_FACTOR;
        // Semi-minor axis
        const b = a * Math.sqrt(1 - eccentricity * eccentricity);
        
        // Coordinates in Orbital Plane (Focus at 0,0)
        // x = a(cosE - e)
        // y = b sinE
        const xOrb = a * (Math.cos(E) - eccentricity);
        const yOrb = b * Math.sin(E);
        
        // Rotate by Argument of Periapsis (w)
        const w = (periapsisDeg * Math.PI) / 180;
        const x = xOrb * Math.cos(w) - yOrb * Math.sin(w);
        const y = xOrb * Math.sin(w) + yOrb * Math.cos(w);
        
        return { x: CENTER + x, y: CENTER + y };
    };

    const moons = TERRAX_SYSTEM.moons.map(moon => {
        const pos = getPosition(
            moon.semiMajorAxisKm,
            moon.orbitalPeriodDays,
            moon.eccentricity,
            moon.periapsisArgument,
            currentDay
        );
        
        const a = moon.semiMajorAxisKm * SCALE_FACTOR;
        const b = a * Math.sqrt(1 - moon.eccentricity * moon.eccentricity);
        const focusOffset = a * moon.eccentricity; // distance from center to focus
        
        return {
            ...moon,
            pos,
            orbitPath: {
                rx: a,
                ry: b,
                // The SVG ellipse is drawn centered.
                // The geometric center is at (-ae, 0) relative to Focus in unrotated frame.
                cx: -focusOffset, 
                cy: 0,
                transform: `rotate(${moon.periapsisArgument})`
            },
            // Markers relative to the orbit group
            periapsis: { cx: (a - focusOffset), cy: 0 }, // Relative to geometric center? No.
            // Let's use the local coordinate system of the orbit group where Focus is (0,0) after translation is removed?
            // Actually, simplest is to define points in the unrotated frame relative to ellipse center.
            // Ellipse center is at (-focusOffset, 0) relative to focus.
            // Periapsis is at +a from geometric center? No, Periapsis is at +a along major axis relative to center?
            // Focus is at +c from center? 
            // Standard ellipse: Center(0,0). Focus1 (-c, 0), Focus2 (c, 0).
            // We want Focus at (0,0). So we shift everything by +c or -c.
            // If we want Periapsis at Angle 0 (Right), then Planet is Focus2 (c, 0). Periapsis is at (a, 0). Distance = a-c = a(1-e). Correct.
            // So relative to Focus (0,0), geometric Center is at (-c, 0).
            // Periapsis is at (a-c, 0). Apoapsis is at (-a-c, 0).
            periapsisX: (a - focusOffset),
            apoapsisX: (-a - focusOffset)
        };
    });

    const luna = moons[0];
    const echo = moons[1];

    return (
        <div className="flex flex-col items-center">
             <div className="relative" style={{ width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} className="overflow-visible">
                    <defs>
                        {TERRAX_SYSTEM.planet.textureUrl ? (
                            <pattern id="orrery-terrax-texture" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <image href={TERRAX_SYSTEM.planet.textureUrl} x="0" y="0" width="1" height="1" preserveAspectRatio="none" />
                            </pattern>
                        ) : null}
                        <filter id="orrery-glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Orbits Group: Centered at planet location */}
                    <g transform={`translate(${CENTER}, ${CENTER})`}>
                        {moons.map(m => (
                            <g key={m.name} transform={m.orbitPath.transform}>
                                {/* Orbit Path */}
                                <ellipse 
                                    cx={m.orbitPath.cx} 
                                    cy={m.orbitPath.cy} 
                                    rx={m.orbitPath.rx} 
                                    ry={m.orbitPath.ry} 
                                    fill="none" 
                                    stroke="#334155" 
                                    strokeDasharray="4 4" 
                                    opacity="0.6"
                                />
                                
                                {/* Periapsis Marker (P) */}
                                <circle cx={m.orbitPath.cx + m.orbitPath.rx} cy={0} r={1.5} fill={m.color} opacity={0.6} />
                                <text x={m.orbitPath.cx + m.orbitPath.rx + 4} y={2} fontSize="6" fill={m.color} opacity="0.6" style={{ pointerEvents: 'none' }}>P</text>
                                
                                {/* Apoapsis Marker (A) */}
                                <circle cx={m.orbitPath.cx - m.orbitPath.rx} cy={0} r={1.5} fill={m.color} opacity={0.3} />
                                <text x={m.orbitPath.cx - m.orbitPath.rx - 6} y={2} fontSize="6" fill={m.color} opacity="0.3" style={{ pointerEvents: 'none' }}>A</text>
                            </g>
                        ))}
                    </g>

                    {/* Planet Terrax */}
                    <circle 
                        cx={CENTER} 
                        cy={CENTER} 
                        r={25} 
                        fill={TERRAX_SYSTEM.planet.textureUrl ? "url(#orrery-terrax-texture)" : "#45a29e"} 
                        filter="url(#orrery-glow)" 
                        stroke={TERRAX_SYSTEM.planet.textureUrl ? "none" : "#45a29e"}
                    />
                    <text x={CENTER} y={CENTER + 5} textAnchor="middle" fill="#0b0c10" fontSize="10" fontWeight="bold" style={{textShadow: '0 0 2px rgba(255,255,255,0.5)'}}>TERRAX</text>

                    {/* Moon Luna */}
                    <circle cx={luna.pos.x} cy={luna.pos.y} r={12} fill="#e2e8f0" />
                    <text x={luna.pos.x} y={luna.pos.y - 16} textAnchor="middle" fill="#94a3b8" fontSize="10">{luna.name}</text>

                    {/* Moon Echo */}
                    <circle cx={echo.pos.x} cy={echo.pos.y} r={8} fill="#94a3b8" />
                    <text x={echo.pos.x} y={echo.pos.y - 12} textAnchor="middle" fill="#64748b" fontSize="10">{echo.name}</text>

                    {/* Sun Direction Indicator */}
                    <path d={`M ${CENTER - 40} ${SIZE + 20} L ${CENTER + 40} ${SIZE + 20} L ${CENTER} ${SIZE + 10} Z`} fill="#fcd34d" opacity="0.5" />
                    <text x={CENTER} y={SIZE + 35} textAnchor="middle" fill="#fcd34d" fontSize="10">TO SOL</text>
                </svg>
             </div>
             <div className="mt-4 text-center text-sm text-slate-400 " style={{ marginTop: '50px' }}>
                <p>Keplerian Orbital Mechanics</p>
                <div className="flex justify-center gap-4 text-[10px] text-slate-600 font-mono mt-1">
                    <span>e={luna.eccentricity}</span>
                    <span>P: Periapsis</span>
                    <span>A: Apoapsis</span>
                    <span>e={echo.eccentricity}</span>
                </div>
             </div>
        </div>
    );
};