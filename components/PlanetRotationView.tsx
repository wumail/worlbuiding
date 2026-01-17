import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface PlanetRotationViewProps {
    currentDay: number;
    timeOfDay: number; // 0-26
}

export const PlanetRotationView: React.FC<PlanetRotationViewProps> = ({ currentDay, timeOfDay }) => {
    // Container Dimensions (handled by parent/RGL, but we need internal aspect ratio)
    // We use a fixed viewBox but let the SVG scale
    const size = 320; 
    const center = size / 2;
    const r = 120;
    const tilt = TERRAX_SYSTEM.planet.axialTilt;
    const dayLength = TERRAX_SYSTEM.planet.rotationPeriodHours;
    const yearLength = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays;

    // Rotation Animation
    const rotationProgress = timeOfDay / dayLength;
    // Map width is 450 (arbitrary pattern width). 
    // We shift negative X to simulate West->East rotation
    const mapOffset = -1 * rotationProgress * 450; 

    // Season / Declination Logic
    const seasonPhase = (currentDay / yearLength) * 2 * Math.PI;
    const declinationRad = (tilt * Math.PI / 180) * Math.sin(seasonPhase);
    const declinationDeg = tilt * Math.sin(seasonPhase);
    
    // Subsolar Point Calculation
    const subSolarYOffset = -1 * r * Math.sin(declinationRad);

    return (
        <div className="flex flex-col items-center w-full h-full bg-[#1f2833] rounded-xl shadow-lg border border-slate-700 overflow-hidden relative">
            {/* Header / Drag Handle */}
            <div className="absolute top-0 left-0 right-0 p-3 z-10 bg-gradient-to-b from-[#1f2833] to-transparent pointer-events-none">
                 <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pointer-events-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 
                    Terrax Rotation
                 </h2>
            </div>

            <div className="flex-grow flex items-center justify-center w-full h-full">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-h-[400px]" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <clipPath id="planetClip">
                            <circle cx={center} cy={center} r={r} />
                        </clipPath>
                        
                        {/* Texture Pattern */}
                        {/* We use an image pattern that repeats. */}
                        <pattern id="earthTexture" x={mapOffset} y="0" width="450" height="450" patternUnits="userSpaceOnUse">
                             {/* Standard Equirectangular Earth Map */}
                             <image 
                                href="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg" 
                                x="0" y="0" 
                                width="450" height="225" 
                                preserveAspectRatio="none"
                             />
                             {/* Repeat for seamless loop if needed, but pattern handles repeat if width matches */}
                        </pattern>

                        {/* Enhanced Pressure/Temperature Gradient */}
                        <linearGradient id="pressureBelts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" /> 
                            <stop offset="10%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="25%" stopColor="#64748b" stopOpacity="0.1" />
                            <stop offset="35%" stopColor="#eab308" stopOpacity="0.4" />
                            <stop offset="45%" stopColor="#ef4444" stopOpacity="0.4" />
                            <stop offset="55%" stopColor="#ef4444" stopOpacity="0.4" />
                            <stop offset="65%" stopColor="#eab308" stopOpacity="0.4" />
                            <stop offset="75%" stopColor="#64748b" stopOpacity="0.1" />
                            <stop offset="90%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                        </linearGradient>

                        <filter id="textGlow">
                            <feFlood floodColor="#000" floodOpacity="0.8"/>
                            <feComposite in2="SourceGraphic" operator="in"/>
                            <feMorphology operator="dilate" radius="1"/>
                            <feGaussianBlur stdDeviation="1"/>
                            <feComposite in2="SourceGraphic" operator="out"/>
                            <feMerge>
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>

                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                            <polygon points="0 0, 6 2, 0 4" fill="#fff" opacity="0.7" />
                        </marker>
                    </defs>

                    {/* Planet Group (Tilted) */}
                    <g transform={`rotate(-${tilt}, ${center}, ${center})`}>
                        {/* Base Planet with Texture */}
                        <circle cx={center} cy={center} r={r} fill="#0e7490" /> {/* Fallback color */}
                        <circle cx={center} cy={center} r={r} fill="url(#earthTexture)" />
                        
                        {/* Atmosphere/Pressure Layers */}
                        <circle cx={center} cy={center} r={r} fill="url(#pressureBelts)" clipPath="url(#planetClip)" />

                        {/* Atmospheric Circulation (Wind Arrows) */}
                        <g clipPath="url(#planetClip)" opacity="0.8">
                            <path d={`M ${center + 40} ${center - 25} Q ${center + 20} ${center - 15} ${center} ${center - 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            <path d={`M ${center - 10} ${center - 25} Q ${center - 30} ${center - 15} ${center - 50} ${center - 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            <path d={`M ${center + 40} ${center + 25} Q ${center + 20} ${center + 15} ${center} ${center + 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                             <path d={`M ${center - 10} ${center + 25} Q ${center - 30} ${center + 15} ${center - 50} ${center + 10}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            <path d={`M ${center - 40} ${center - 45} Q ${center - 20} ${center - 55} ${center} ${center - 60}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            <path d={`M ${center - 40} ${center + 45} Q ${center - 20} ${center + 55} ${center} ${center + 60}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                            <path d={`M ${center + 20} ${center - 80} Q ${center} ${center - 85} ${center - 20} ${center - 80}`} stroke="#fff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                        </g>

                        {/* Lat/Long Grid */}
                        <g opacity="0.3" stroke="#fff" strokeWidth="1" fill="none" clipPath="url(#planetClip)">
                            <ellipse cx={center} cy={center} rx={r*0.3} ry={r} />
                            <ellipse cx={center} cy={center} rx={r*0.6} ry={r} />
                            <line x1={center} y1={center-r} x2={center} y2={center+r} />
                            <line x1={center-r} y1={center} x2={center+r} y2={center} stroke="#fcd34d" strokeWidth="2" />
                        </g>

                        {/* Subsolar Point Marker */}
                        <g transform={`translate(${center}, ${center + subSolarYOffset})`}>
                             <circle r="5" fill="#fef08a" stroke="#b45309" strokeWidth="2" opacity="0.8" />
                             <text x="8" y="3" fill="#fef08a" fontSize="10" fontWeight="bold" filter="url(#textGlow)">Sun</text>
                        </g>
                    </g>

                    {/* Atmosphere Glow Outer */}
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" />

                    {/* Shadow (Terminator) */}
                    <g transform={`rotate(${declinationDeg}, ${center}, ${center})`}>
                        <path d={`M ${center} ${center-r} A ${r} ${r} 0 0 1 ${center} ${center+r} L ${center+r} ${center+r} L ${center+r} ${center-r} Z`} fill="black" opacity="0.65" clipPath="url(#planetClip)" />
                    </g>
                    
                </svg>
            </div>
        </div>
    );
};