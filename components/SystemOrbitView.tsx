import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface SystemOrbitViewProps {
    currentDay: number;
}

export const SystemOrbitView: React.FC<SystemOrbitViewProps> = ({ currentDay }) => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const sunRadius = 15;
    const planetRadius = 6;

    const yearLength = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays;
    
    // Angle in radians. -PI/2 is top (Spring Equinox start? Usually Vernal Equinox is taken as 0 or start).
    // Let's assume Day 1 is Vernal Equinox (Top).
    // Orbit is counter-clockwise.
    const angle = ((currentDay / yearLength) * 2 * Math.PI) - (Math.PI / 2);
    
    const planetX = center + radius * Math.cos(angle);
    const planetY = center + radius * Math.sin(angle);

    // Season Arcs
    const seasonOffset = -Math.PI / 2;
    const seasons = [
        { name: 'Spring', color: '#a7f3d0', start: 0, end: 0.25 },
        { name: 'Summer', color: '#fde047', start: 0.25, end: 0.5 },
        { name: 'Autumn', color: '#fdba74', start: 0.5, end: 0.75 },
        { name: 'Winter', color: '#93c5fd', start: 0.75, end: 1.0 },
    ];

    const getArcPath = (startPct: number, endPct: number) => {
        const startAngle = (startPct * 2 * Math.PI) + seasonOffset;
        const endAngle = (endPct * 2 * Math.PI) + seasonOffset;
        
        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);
        
        const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
        
        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Orbit Path Segments (Seasons) */}
                    {seasons.map((season, i) => (
                        <path 
                            key={season.name}
                            d={getArcPath(season.start, season.end)}
                            fill="none"
                            stroke={season.color}
                            strokeWidth="4"
                            opacity="0.6"
                        />
                    ))}

                    {/* Star (Sol) */}
                    <circle cx={center} cy={center} r={sunRadius} fill="#fbbf24" filter="drop-shadow(0 0 15px rgba(251, 191, 36, 0.6))" />
                    <text x={center} y={center + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">SOL</text>

                    {/* Planet (Terrax) */}
                    <circle cx={planetX} cy={planetY} r={planetRadius} fill="#22d3ee" stroke="#000" strokeWidth="1" />

                    {/* Radial Line to Planet */}
                    <line x1={center} y1={center} x2={planetX} y2={planetY} stroke="#fff" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* Season Labels */}
                    <text x={center} y={center - radius - 15} textAnchor="middle" fill="#a7f3d0" fontSize="10" opacity="0.8">SPRING</text>
                    <text x={center + radius + 25} y={center} textAnchor="middle" fill="#fde047" fontSize="10" opacity="0.8">SUMMER</text>
                    <text x={center} y={center + radius + 20} textAnchor="middle" fill="#fdba74" fontSize="10" opacity="0.8">AUTUMN</text>
                    <text x={center - radius - 25} y={center} textAnchor="middle" fill="#93c5fd" fontSize="10" opacity="0.8">WINTER</text>

                </svg>
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">
                Helio-centric View • Counter-clockwise Orbit
            </div>
        </div>
    );
};