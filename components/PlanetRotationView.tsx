import React from 'react';
import { TERRAX_SYSTEM } from '../constants';
import { Clock, Sun } from 'lucide-react';

interface PlanetRotationViewProps {
    currentDay: number;
    timeOfDay: number;
    latitude?: number;
}

export const PlanetRotationView: React.FC<PlanetRotationViewProps> = ({ currentDay, timeOfDay, latitude = 24 }) => {
    const size = 320; 
    const center = size / 2;
    const r = 100; // Planet Radius
    const tilt = TERRAX_SYSTEM.planet.axialTilt;
    const dayLength = TERRAX_SYSTEM.planet.rotationPeriodHours;
    const yearLength = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays;

    // Rotation progress for longitude tracking
    const rotationProgress = (timeOfDay / dayLength) * 360;

    // Season / Solar Declination Logic
    const seasonPhase = (currentDay / yearLength) * 2 * Math.PI;
    const declinationDeg = tilt * Math.sin(seasonPhase);

    // Generate Meridian paths (Longitude lines)
    const meridians = [0, 45, 90, 135, 180, 225, 270, 315];
    // Generate Parallel paths (Latitude lines)
    const parallels = [-60, -30, 0, 30, 60];

    return (
        <div className="flex flex-col items-center w-full h-full bg-[#1f2833]/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative group">
            <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-[#1f2833] to-transparent drag-handle cursor-move flex items-center justify-between">
                 <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Clock size={14} className="text-indigo-400" /> Terrax Rotation
                 </h2>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-yellow-400">
                        <Sun size={10} /> {declinationDeg.toFixed(1)}°
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">AXIAL: {tilt}°</div>
                 </div>
            </div>

            <div className="flex-grow flex items-center justify-center w-full min-h-0 bg-slate-900/20">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-h-[350px]" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <clipPath id="planetClip">
                            <circle cx={center} cy={center} r={r} />
                        </clipPath>
                        
                        {/* Use Texture if available, else Gradient */}
                        {TERRAX_SYSTEM.planet.textureUrl ? (
                            <pattern id="planetTexture" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <image href={TERRAX_SYSTEM.planet.textureUrl} x="0" y="0" width="1" height="1" preserveAspectRatio="none" />
                            </pattern>
                        ) : (
                            <radialGradient id="planetSphere" cx="30%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#45a29e" />
                                <stop offset="100%" stopColor="#1f2833" />
                            </radialGradient>
                        )}

                        {/* Pressure Belts Gradient (Subtle Overlay) */}
                        <linearGradient id="pressureBelts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" /> 
                            <stop offset="15%" stopColor="#3b82f6" stopOpacity="0.05" />
                            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.1" />
                            <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
                        </linearGradient>

                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Ecliptic Plane (Background) */}
                    <line x1={center - r - 40} y1={center} x2={center + r + 40} y2={center} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                    <text x={center + r + 45} y={center + 3} fontSize="7" fill="#475569" fontWeight="bold">ECLIPTIC PLANE</text>

                    {/* Planet Rotation Group (Tilted) */}
                    <g transform={`rotate(${-tilt}, ${center}, ${center})`}>
                        {/* Equatorial Plane */}
                        <ellipse cx={center} cy={center} rx={r + 30} ry={5} fill="none" stroke="#fcd34d" strokeWidth="0.5" opacity="0.4" />
                        <line x1={center - r - 30} y1={center} x2={center + r + 30} y2={center} stroke="#fcd34d" strokeWidth="1" opacity="0.4" />

                        {/* Planet Body Background with Texture */}
                        <circle 
                            cx={center} 
                            cy={center} 
                            r={r} 
                            fill={TERRAX_SYSTEM.planet.textureUrl ? "url(#planetTexture)" : "url(#planetSphere)"} 
                            filter="url(#glow)" 
                        />
                        
                        {/* Climate Bands Overlay */}
                        <circle cx={center} cy={center} r={r} fill="url(#pressureBelts)" clipPath="url(#planetClip)" />

                        {/* Graticule Lines (Grid) */}
                        <g clipPath="url(#planetClip)" opacity="0.2">
                            {/* Parallels */}
                            {parallels.map(p => (
                                <ellipse 
                                    key={`lat-${p}`}
                                    cx={center} 
                                    cy={center - (r * Math.sin(p * Math.PI / 180))} 
                                    rx={r * Math.cos(p * Math.PI / 180)} 
                                    ry={r * 0.1} 
                                    fill="none" 
                                    stroke="#fff" 
                                    strokeWidth="0.5" 
                                />
                            ))}
                            {/* Meridians (Rotating) */}
                            {meridians.map(m => {
                                const angle = (m + rotationProgress) % 360;
                                const isFront = angle > 90 && angle < 270;
                                if (!isFront) return null; // Simplified 2D projection
                                return (
                                    <ellipse 
                                        key={`lon-${m}`}
                                        cx={center} 
                                        cy={center} 
                                        rx={r * Math.cos((angle - 180) * Math.PI / 180)} 
                                        ry={r} 
                                        fill="none" 
                                        stroke="#fff" 
                                        strokeWidth="0.5" 
                                    />
                                );
                            })}
                        </g>

                        {/* Latitude Highlight for Observer */}
                        <ellipse 
                            cx={center} 
                            cy={center - (r * Math.sin(latitude * Math.PI / 180))} 
                            rx={r * Math.cos(latitude * Math.PI / 180)} 
                            ry={r * 0.05} 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="1.5" 
                            opacity="0.8"
                        />

                        {/* Observer Marker */}
                        <circle 
                            cx={center} 
                            cy={center - (r * Math.sin(latitude * Math.PI / 180))} 
                            r="3.5" 
                            fill="#ef4444" 
                            stroke="#fff" 
                            strokeWidth="1.5" 
                            filter="url(#glow)"
                        />
                    </g>

                    {/* Terminator / Solar Incidence Shadow */}
                    <g transform={`rotate(${declinationDeg}, ${center}, ${center})`}>
                        <path 
                            d={`M ${center} ${center - r} A ${r} ${r} 0 0 1 ${center} ${center + r} L ${center + r} ${center + r} L ${center + r} ${center - r} Z`} 
                            fill="#000" 
                            opacity="0.6" 
                            clipPath="url(#planetClip)" 
                        />
                        {/* Subsolar Point Marker */}
                        <line x1={center - r - 20} y1={center} x2={center - r} y2={center} stroke="#fcd34d" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <text x={center - r - 45} y={center - 10} fontSize="7" fill="#fcd34d" fontWeight="bold">SOLAR ZENITH</text>
                    </g>

                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#fcd34d" />
                        </marker>
                    </defs>
                </svg>
            </div>

            <div className="p-4 bg-slate-900/60 w-full border-t border-slate-700/50 flex justify-between items-center shrink-0">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Latitudinal Position</span>
                    <span className="text-xs text-white font-mono">{latitude.toFixed(1)}° {latitude >= 0 ? 'NORTH' : 'SOUTH'}</span>
                </div>
                <div className="text-right flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Rotation Status</span>
                    <span className="text-xs text-indigo-400 font-mono">ACTIVE @ {dayLength}H/CYCLE</span>
                </div>
            </div>
        </div>
    );
};