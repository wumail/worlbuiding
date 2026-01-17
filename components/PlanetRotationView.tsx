import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface PlanetRotationViewProps {
    currentDay: number;
    timeOfDay: number; // 0-26
}

export const PlanetRotationView: React.FC<PlanetRotationViewProps> = ({ currentDay, timeOfDay }) => {
    const size = 300; // Increased size
    const center = size / 2;
    const r = 120; // Increased radius
    const tilt = TERRAX_SYSTEM.planet.axialTilt;
    const dayLength = TERRAX_SYSTEM.planet.rotationPeriodHours;
    const yearLength = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays;

    // Rotation Animation
    const rotationProgress = timeOfDay / dayLength;
    const mapOffset = rotationProgress * 450; 

    // Season / Declination Logic
    // Season Phase 0 = Spring Equinox. Sun at Equator.
    // Phase PI/2 = Summer Solstice. Sun at +25deg (North).
    const seasonPhase = (currentDay / yearLength) * 2 * Math.PI;
    const declinationRad = (tilt * Math.PI / 180) * Math.sin(seasonPhase);
    const declinationDeg = tilt * Math.sin(seasonPhase);
    
    // Subsolar Point Calculation (Y position on the 2D circle)
    // Positive Declination (North) means Sun is "higher" visually if North is Up.
    // Note: SVG Y is down. North is Up. So Positive Declination -> Lower Y value relative to center?
    // Actually, let's keep it simple: Tilted Axis means we rotate the whole globe. 
    // The "Sun" stays to the left. The "Subsolar point" is fixed x-axis (left side), 
    // but the latitude it hits changes due to tilt.
    // However, visualizing the point ON the map requires untilting logic or simple visual approximation.
    // We will draw the marker on the surface.
    
    const subSolarYOffset = -1 * r * Math.sin(declinationRad);

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                        <clipPath id="planetClip">
                            <circle cx={center} cy={center} r={r} />
                        </clipPath>
                        
                        {/* Continent Pattern */}
                        <pattern id="landPattern" x={mapOffset} y="0" width="450" height="300" patternUnits="userSpaceOnUse">
                            <rect width="450" height="300" fill="#0e7490" /> {/* Ocean */}
                            <path d="M 30 75 Q 75 30 120 75 T 210 120 T 75 225 Z" fill="#15803d" opacity="0.6" />
                            <path d="M 270 45 Q 330 15 375 60 T 420 180 T 300 240 Z" fill="#15803d" opacity="0.6" />
                            <path d="M 150 150 Q 195 135 225 165" stroke="#fff" strokeWidth="2" fill="none" opacity="0.2" /> 
                        </pattern>

                        {/* Pressure Belts Gradient (Overlay) */}
                        <linearGradient id="pressureBelts" x1="0" y1="0" x2="0" y2="1">
                            {/* Polar High */}
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.1" /> 
                            <stop offset="10%" stopColor="#fff" stopOpacity="0.0" />
                            {/* Ferrel Cell (Low) */}
                            <stop offset="25%" stopColor="#000" stopOpacity="0.1" />
                            {/* Horse Latitudes (High) */}
                            <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.1" />
                            {/* ITCZ (Low - Equator) */}
                            <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.2" />
                            <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.2" />
                            {/* Horse Latitudes (South) */}
                            <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.1" />
                            {/* Ferrel Cell */}
                            <stop offset="75%" stopColor="#000" stopOpacity="0.1" />
                            {/* Polar */}
                            <stop offset="90%" stopColor="#fff" stopOpacity="0.0" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Planet Group (Tilted) */}
                    <g transform={`rotate(-${tilt}, ${center}, ${center})`}>
                        {/* Base Planet */}
                        <circle cx={center} cy={center} r={r} fill="url(#landPattern)" />
                        
                        {/* Atmosphere/Pressure Layers */}
                        <circle cx={center} cy={center} r={r} fill="url(#pressureBelts)" clipPath="url(#planetClip)" />

                        {/* Lat/Long Grid */}
                        <g opacity="0.3" stroke="#fff" strokeWidth="1" fill="none" clipPath="url(#planetClip)">
                            {/* Longitude Lines */}
                            <ellipse cx={center} cy={center} rx={r*0.3} ry={r} />
                            <ellipse cx={center} cy={center} rx={r*0.6} ry={r} />
                            <ellipse cx={center} cy={center} rx={r*0.9} ry={r} />
                            <line x1={center} y1={center-r} x2={center} y2={center+r} />
                            
                            {/* Latitude Lines */}
                            <line x1={center-r} y1={center} x2={center+r} y2={center} stroke="#fcd34d" strokeWidth="2" /> {/* Equator */}
                            <line x1={center-r} y1={center - r*0.33} x2={center+r} y2={center - r*0.33} strokeDasharray="4 4"/>
                            <line x1={center-r} y1={center - r*0.66} x2={center+r} y2={center - r*0.66} strokeDasharray="4 4"/>
                            <line x1={center-r} y1={center + r*0.33} x2={center+r} y2={center + r*0.33} strokeDasharray="4 4"/>
                            <line x1={center-r} y1={center + r*0.66} x2={center+r} y2={center + r*0.66} strokeDasharray="4 4"/>
                        </g>

                        {/* Axis Pole */}
                        <line x1={center} y1={center - r - 15} x2={center} y2={center + r + 15} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
                    </g>

                    {/* Atmosphere Glow Outer */}
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" />

                    {/* Shadow (Terminator) */}
                    {/* The shadow angle changes slightly with declination relative to the viewer, but mostly it's fixed to the Sun's position if we rotate the planet */}
                    <g transform={`rotate(${declinationDeg}, ${center}, ${center})`}>
                        <path d={`M ${center} ${center-r} A ${r} ${r} 0 0 1 ${center} ${center+r} L ${center+r} ${center+r} L ${center+r} ${center-r} Z`} fill="black" opacity="0.6" clipPath="url(#planetClip)" />
                    </g>

                    {/* Subsolar Point Marker (Direct Sunlight) */}
                    {/* We need to apply the tilt rotation to position this correctly relative to the "untilted" coordinate system */}
                    <g transform={`rotate(-${tilt}, ${center}, ${center})`}>
                        <g transform={`translate(${center}, ${center + subSolarYOffset})`}>
                             <circle r="4" fill="#fbbf24" stroke="white" strokeWidth="1" />
                             <circle r="8" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.8">
                                <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                             </circle>
                        </g>
                    </g>
                    
                    {/* Labels */}
                    <text x={center + r + 10} y={center} fill="#fcd34d" fontSize="10" alignmentBaseline="middle">Equator</text>
                    <text x={center} y={center - r - 20} textAnchor="middle" fill="#cbd5e1" fontSize="10">North</text>
                    
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] text-slate-500 mt-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> Subsolar Point</div>
                <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-yellow-400"></div> Equator</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-900/50 border border-cyan-500 rounded"></div> Low Pressure (Rain)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-600/50 border border-yellow-500 rounded"></div> High Pressure (Dry)</div>
            </div>
        </div>
    );
};