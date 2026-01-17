import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface PlanetRotationViewProps {
    currentDay: number;
    timeOfDay: number; // 0-26
}

export const PlanetRotationView: React.FC<PlanetRotationViewProps> = ({ currentDay, timeOfDay }) => {
    const size = 200;
    const center = size / 2;
    const r = 80;
    const tilt = TERRAX_SYSTEM.planet.axialTilt;
    const dayLength = TERRAX_SYSTEM.planet.rotationPeriodHours;
    const yearLength = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays;

    // Rotation Animation: Continents move West to East (Left to Right)
    // Map width = 2 * PI * r roughly.
    // 0 hours = 0 offset. 26 hours = full width offset.
    const rotationProgress = timeOfDay / dayLength;
    const mapOffset = rotationProgress * 300; // Arbitrary texture width unit

    // Lighting / Season Logic
    // Assume Sun is to the LEFT (-x direction).
    const seasonPhase = (currentDay / yearLength) * 2 * Math.PI;
    // Approximating Declination effect for visual flair
    // At Solstice (Season Phase ~PI/2 or 3PI/2), declination is max.
    const declinationDeg = tilt * Math.sin(seasonPhase);
    
    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                        <clipPath id="planetClip">
                            <circle cx={center} cy={center} r={r} />
                        </clipPath>
                        {/* Simple Cloud/Continent Pattern */}
                        <pattern id="landPattern" x={mapOffset} y="0" width="300" height="200" patternUnits="userSpaceOnUse">
                            <rect width="300" height="200" fill="#0e7490" /> {/* Ocean */}
                            {/* Continents */}
                            <path d="M 20 50 Q 50 20 80 50 T 140 80 T 50 150 Z" fill="#15803d" opacity="0.6" />
                            <path d="M 180 30 Q 220 10 250 40 T 280 120 T 200 160 Z" fill="#15803d" opacity="0.6" />
                            <path d="M 100 100 Q 130 90 150 110" stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" /> {/* Clouds */}
                        </pattern>
                    </defs>

                    {/* Planet (Tilted) */}
                    <g transform={`rotate(-${tilt}, ${center}, ${center})`}>
                        <circle cx={center} cy={center} r={r} fill="#0e7490" />
                        <circle cx={center} cy={center} r={r} fill="url(#landPattern)" clipPath="url(#planetClip)" />
                        {/* Axis Line */}
                        <line x1={center} y1={center - r - 10} x2={center} y2={center + r + 10} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    </g>

                    {/* Atmosphere Glow */}
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />

                    {/* Shadow (Rotated by Season Declination to simulate sun angle relative to axis) */}
                    {/* Visual approximation: Shadow covers right half, but tilts slightly with season to show pole illumination */}
                    <g transform={`rotate(${declinationDeg}, ${center}, ${center})`}>
                         <path d={`M ${center} ${center-r} A ${r} ${r} 0 0 1 ${center} ${center+r} L ${center+r} ${center+r} L ${center+r} ${center-r} Z`} fill="black" opacity="0.5" clipPath="url(#planetClip)" />
                    </g>
                    
                    <text x={center} y={size - 10} textAnchor="middle" fill="#94a3b8" fontSize="10">
                        Rotation: {timeOfDay}:00 • Tilt: 25°
                    </text>
                </svg>
            </div>
        </div>
    );
};