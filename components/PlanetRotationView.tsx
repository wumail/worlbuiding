import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface PlanetRotationViewProps {
    currentDay: number;
    timeOfDay: number; // 0-26
}

export const PlanetRotationView: React.FC<PlanetRotationViewProps> = ({ currentDay, timeOfDay }) => {
    const size = 320; 
    const center = size / 2;
    const r = 120;
    const tilt = TERRAX_SYSTEM.planet.axialTilt;
    const dayLength = TERRAX_SYSTEM.planet.rotationPeriodHours;
    const yearLength = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays;

    // Rotation Animation
    const rotationProgress = timeOfDay / dayLength;
    const mapOffset = rotationProgress * 450; 

    // Season / Declination Logic
    const seasonPhase = (currentDay / yearLength) * 2 * Math.PI;
    const declinationRad = (tilt * Math.PI / 180) * Math.sin(seasonPhase);
    const declinationDeg = tilt * Math.sin(seasonPhase);
    
    // Subsolar Point Calculation
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

                        {/* Enhanced Pressure/Temperature Gradient */}
                        {/* Colors: Red (Hot/Low P) -> Yellow (High P/Dry) -> Blue (Cold) */}
                        <linearGradient id="pressureBelts" x1="0" y1="0" x2="0" y2="1">
                            {/* North Polar High (Cold) */}
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" /> 
                            <stop offset="10%" stopColor="#3b82f6" stopOpacity="0.2" />
                            
                            {/* Ferrel Cell (Unstable) */}
                            <stop offset="25%" stopColor="#64748b" stopOpacity="0.1" />
                            
                            {/* Horse Latitudes (Hot/Dry High) */}
                            <stop offset="35%" stopColor="#eab308" stopOpacity="0.4" />
                            
                            {/* ITCZ (Equator - Hot/Wet Low) */}
                            <stop offset="45%" stopColor="#ef4444" stopOpacity="0.4" />
                            <stop offset="55%" stopColor="#ef4444" stopOpacity="0.4" />
                            
                            {/* Horse Latitudes (South) */}
                            <stop offset="65%" stopColor="#eab308" stopOpacity="0.4" />
                            
                            {/* Ferrel Cell */}
                            <stop offset="75%" stopColor="#64748b" stopOpacity="0.1" />
                            
                            {/* South Polar High */}
                            <stop offset="90%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>

                        {/* Text Shadow Filter */}
                        <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feFlood floodColor="#000" floodOpacity="0.8"/>
                            <feComposite in2="SourceGraphic" operator="in"/>
                            <feMorphology operator="dilate" radius="2"/>
                            <feGaussianBlur stdDeviation="1"/>
                            <feComposite in2="SourceGraphic" operator="out"/>
                            <feMerge>
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>

                        {/* Arrow Marker */}
                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                            <polygon points="0 0, 6 2, 0 4" fill="#fff" opacity="0.7" />
                        </marker>
                    </defs>

                    {/* Ecliptic Plane (Background Line) */}
                    <line x1={0} y1={center} x2={size} y2={center} stroke="#a78bfa" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
                    <text x={10} y={center - 5} fill="#a78bfa" fontSize="9" opacity="0.8">Ecliptic Plane</text>

                    {/* Planet Group (Tilted) */}
                    <g transform={`rotate(-${tilt}, ${center}, ${center})`}>
                        {/* Base Planet */}
                        <circle cx={center} cy={center} r={r} fill="url(#landPattern)" />
                        
                        {/* Atmosphere/Pressure Layers (Enhanced Visibility) */}
                        <circle cx={center} cy={center} r={r} fill="url(#pressureBelts)" clipPath="url(#planetClip)" />

                        {/* Atmospheric Circulation (Wind Arrows) */}
                        <g clipPath="url(#planetClip)" opacity="0.8">
                            {/* NE Trade Winds (0-30N) - Moving SW */}
                            <path d={`M ${center + 40} ${center - 25} Q ${center + 20} ${center - 15} ${center} ${center - 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            <path d={`M ${center - 10} ${center - 25} Q ${center - 30} ${center - 15} ${center - 50} ${center - 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />

                            {/* SE Trade Winds (0-30S) - Moving NW */}
                            <path d={`M ${center + 40} ${center + 25} Q ${center + 20} ${center + 15} ${center} ${center + 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                             <path d={`M ${center - 10} ${center + 25} Q ${center - 30} ${center + 15} ${center - 50} ${center + 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />

                            {/* Westerlies (30-60N) - Moving NE */}
                            <path d={`M ${center - 40} ${center - 45} Q ${center - 20} ${center - 55} ${center} ${center - 60}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            
                            {/* Westerlies (30-60S) - Moving SE */}
                            <path d={`M ${center - 40} ${center + 45} Q ${center - 20} ${center + 55} ${center} ${center + 60}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            
                            {/* Polar Easterlies (60-90N) - Moving SW */}
                            <path d={`M ${center + 20} ${center - 80} Q ${center} ${center - 85} ${center - 20} ${center - 80}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                        </g>

                        {/* Lat/Long Grid */}
                        <g opacity="0.3" stroke="#fff" strokeWidth="1" fill="none" clipPath="url(#planetClip)">
                            <ellipse cx={center} cy={center} rx={r*0.3} ry={r} />
                            <ellipse cx={center} cy={center} rx={r*0.6} ry={r} />
                            <line x1={center} y1={center-r} x2={center} y2={center+r} />
                            
                            <line x1={center-r} y1={center} x2={center+r} y2={center} stroke="#fcd34d" strokeWidth="2" /> {/* Equator */}
                            <line x1={center-r} y1={center - r*0.33} x2={center+r} y2={center - r*0.33} strokeDasharray="4 4"/>
                            <line x1={center-r} y1={center - r*0.66} x2={center+r} y2={center - r*0.66} strokeDasharray="4 4"/>
                            <line x1={center-r} y1={center + r*0.33} x2={center+r} y2={center + r*0.33} strokeDasharray="4 4"/>
                            <line x1={center-r} y1={center + r*0.66} x2={center+r} y2={center + r*0.66} strokeDasharray="4 4"/>
                        </g>

                        {/* Subsolar Point Marker */}
                        <g transform={`translate(${center}, ${center + subSolarYOffset})`}>
                             <line x1="-100" y1="0" x2="-15" y2="0" stroke="#fef08a" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="2 2" />
                             <circle r="6" fill="#fef08a" stroke="#b45309" strokeWidth="2">
                                <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="fill-opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                             </circle>
                             <line x1="-8" y1="0" x2="8" y2="0" stroke="#b45309" strokeWidth="1" />
                             <line x1="0" y1="-8" x2="0" y2="8" stroke="#b45309" strokeWidth="1" />
                             <text x="12" y="3" fill="#fef08a" fontSize="10" fontWeight="bold" filter="url(#textGlow)">Direct Sunlight</text>
                        </g>

                        {/* Axis Pole */}
                        <line x1={center} y1={center - r - 20} x2={center} y2={center + r + 20} stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 4" />
                        
                         {/* Labels */}
                        <text x={center + r + 5} y={center} fill="#fcd34d" fontSize="10" alignmentBaseline="middle" filter="url(#textGlow)">Equator</text>
                        <text x={center} y={center - r - 25} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold" filter="url(#textGlow)">North Pole</text>
                    </g>

                    {/* Atmosphere Glow Outer */}
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" />

                    {/* Shadow (Terminator) */}
                    <g transform={`rotate(${declinationDeg}, ${center}, ${center})`}>
                        <path d={`M ${center} ${center-r} A ${r} ${r} 0 0 1 ${center} ${center+r} L ${center+r} ${center+r} L ${center+r} ${center-r} Z`} fill="black" opacity="0.6" clipPath="url(#planetClip)" />
                    </g>
                    
                </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-500 mt-2 px-4">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full opacity-60"></div> Low Pressure (Warm/Wet)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full opacity-60"></div> High Pressure (Dry)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full opacity-60"></div> Polar Cold</div>
                <div className="flex items-center gap-1"><span className="text-white text-xs">→</span> Prevailing Winds</div>
            </div>
        </div>
    );
};