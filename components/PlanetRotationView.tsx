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
    
    // Subsolar Point Calculation (Relative to center)
    // Positive Declination (North) -> Moves "Up" on the planet surface relative to the equator.
    // In our SVG, if we rotate the planet group by -Tilt, the Equator is horizontal *within the group*.
    // So the Y offset along the axis is -r * sin(decl).
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
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.1" /> 
                            <stop offset="10%" stopColor="#fff" stopOpacity="0.0" />
                            <stop offset="25%" stopColor="#000" stopOpacity="0.1" />
                            <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.1" />
                            <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.2" />
                            <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.2" />
                            <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.1" />
                            <stop offset="75%" stopColor="#000" stopOpacity="0.1" />
                            <stop offset="90%" stopColor="#fff" stopOpacity="0.0" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
                        </linearGradient>

                        {/* Text Shadow Filter for Readability */}
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
                    </defs>

                    {/* Ecliptic Plane (Background Line) */}
                    <line x1={0} y1={center} x2={size} y2={center} stroke="#a78bfa" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
                    <text x={10} y={center - 5} fill="#a78bfa" fontSize="9" opacity="0.8">Ecliptic Plane</text>

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

                        {/* Subsolar Point Marker (Direct Sunlight) */}
                        {/* Positioned inside the tilted frame, moving North/South based on declination */}
                        <g transform={`translate(${center}, ${center + subSolarYOffset})`}>
                             {/* Beams */}
                             <line x1="-100" y1="0" x2="-15" y2="0" stroke="#fef08a" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="2 2" />
                             
                             {/* Impact Point */}
                             <circle r="6" fill="#fef08a" stroke="#b45309" strokeWidth="2">
                                <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="fill-opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                             </circle>
                             {/* Crosshair */}
                             <line x1="-8" y1="0" x2="8" y2="0" stroke="#b45309" strokeWidth="1" />
                             <line x1="0" y1="-8" x2="0" y2="8" stroke="#b45309" strokeWidth="1" />
                             
                             {/* Label for Sunlight */}
                             <text x="12" y="3" fill="#fef08a" fontSize="10" fontWeight="bold" filter="url(#textGlow)">Direct Sunlight</text>
                        </g>

                        {/* Axis Pole */}
                        <line x1={center} y1={center - r - 20} x2={center} y2={center + r + 20} stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 4" />
                        
                         {/* Equator Label */}
                        <text x={center + r + 5} y={center} fill="#fcd34d" fontSize="10" alignmentBaseline="middle" filter="url(#textGlow)">Equator</text>
                        <text x={center} y={center - r - 25} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold" filter="url(#textGlow)">North Pole</text>
                    </g>

                    {/* Atmosphere Glow Outer */}
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" />

                    {/* Shadow (Terminator) */}
                    {/* Rotated by declination to simulate day/night relative to Sun */}
                    <g transform={`rotate(${declinationDeg}, ${center}, ${center})`}>
                        <path d={`M ${center} ${center-r} A ${r} ${r} 0 0 1 ${center} ${center+r} L ${center+r} ${center+r} L ${center+r} ${center-r} Z`} fill="black" opacity="0.6" clipPath="url(#planetClip)" />
                    </g>
                    
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] text-slate-500 mt-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-200 border border-yellow-600 rounded-full"></div> Subsolar Point</div>
                <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-yellow-400"></div> Equator</div>
                <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-purple-400 border-dashed border-b"></div> Ecliptic Plane</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-900/50 border border-cyan-500 rounded"></div> Low Pressure</div>
            </div>
        </div>
    );
};