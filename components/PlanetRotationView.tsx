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
    
    // Pattern offset for texture rotation (based on 300px wide pattern)
    const patternOffset = -(rotationProgress / 360) * 300;

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

                        <pattern id="landPattern" x={patternOffset} y="0" width="300" height="200" patternUnits="userSpaceOnUse">
                            <rect width="300" height="200" fill="#0e7490" /> {/* Ocean */}
                            {/* Continents */}
                            <path d="M 20 50 Q 50 20 80 50 T 140 80 T 50 150 Z" fill="#15803d" opacity="0.6" />
                            <path d="M 180 30 Q 220 10 250 40 T 280 120 T 200 160 Z" fill="#15803d" opacity="0.6" />
                            <path d="M 100 100 Q 130 90 150 110" stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" /> {/* Clouds */}
                        </pattern>

                        {/* Spherical Shading Gradient */}
                        <radialGradient id="sphereShading" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                        </radialGradient>

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
                        {/* Planet Body Background with Texture */}
                        <circle 
                            cx={center} 
                            cy={center} 
                            r={r} 
                            fill="url(#landPattern)"
                            clipPath="url(#planetClip)"
                        />
                        
                        {/* Spherical Shading */}
                        <circle 
                            cx={center} 
                            cy={center} 
                            r={r} 
                            fill="url(#sphereShading)"
                            clipPath="url(#planetClip)"
                        />
                        
                        {/* Climate Bands Overlay */}
                        <circle cx={center} cy={center} r={r} fill="url(#pressureBelts)" clipPath="url(#planetClip)" />

                        {/* Rotating Surface Features to Show Rotation */}
                        <g clipPath="url(#planetClip)">
                            {/* Prominent Meridian Markers for Rotation */}
                            {[0, 120, 240].map((baseLon) => {
                                const lon = (baseLon + rotationProgress) % 360;
                                const isFront = lon > 70 && lon < 290;
                                if (!isFront) return null;
                                
                                const angle = (lon - 180) * Math.PI / 180;
                                const cosAngle = Math.cos(angle);
                                const opacity = Math.abs(cosAngle) * 0.3;
                                
                                return (
                                    <ellipse 
                                        key={`rotating-meridian-${baseLon}`}
                                        cx={center} 
                                        cy={center} 
                                        rx={Math.abs(r * cosAngle)} 
                                        ry={r} 
                                        fill="none" 
                                        stroke="#ffffff" 
                                        strokeWidth="1" 
                                        opacity={opacity}
                                    />
                                );
                            })}
                        </g>

                        {/* Graticule Lines (Grid) */}
                        <g clipPath="url(#planetClip)" opacity="0.15">
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
                                if (!isFront) return null;
                                return (
                                    <ellipse 
                                        key={`lon-${m}`}
                                        cx={center} 
                                        cy={center} 
                                        rx={r * Math.cos((angle - 180) * Math.PI / 180)} 
                                        ry={r} 
                                        fill="none" 
                                        stroke="#fff" 
                                        strokeWidth="0.3" 
                                    />
                                );
                            })}
                        </g>

                        {/* Prime Meridian Indicator - Red Line */}
                        <g clipPath="url(#planetClip)">
                            {(() => {
                                const primeLon = rotationProgress % 360;
                                const isFront = primeLon > 90 && primeLon < 270;
                                if (!isFront) return null;
                                
                                const angle = (primeLon - 180) * Math.PI / 180;
                                const cosAngle = Math.cos(angle);
                                
                                return (
                                    <ellipse 
                                        cx={center} 
                                        cy={center} 
                                        rx={Math.abs(r * cosAngle)} 
                                        ry={r} 
                                        fill="none" 
                                        stroke="#ef4444" 
                                        strokeWidth="1.5" 
                                        opacity={Math.abs(cosAngle) * 0.8}
                                    />
                                );
                            })()}
                        </g>

                        {/* Latitude Highlight for Observer */}
                        {(() => {
                            const latRad = latitude * Math.PI / 180;
                            const y = center - (r * Math.sin(latRad));
                            const rx = r * Math.cos(latRad);
                            const ry = r * 0.05;
                            
                            // If in northern hemisphere (positive latitude), show back half (far side)
                            // If in southern hemisphere (negative latitude), show front half (near side)
                            const isNorthern = latitude >= 0;
                            
                            // For northern hemisphere: draw back arc (from right to left going behind)
                            // For southern hemisphere: draw front arc (from left to right in front)
                            const startX = isNorthern ? center + rx : center - rx;
                            const endX = isNorthern ? center - rx : center + rx;
                            
                            return (
                                <path
                                    d={`M ${startX} ${y} A ${rx} ${ry} 0 0 0 ${endX} ${y}`}
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="1.5"
                                    opacity="0.8"
                                />
                            );
                        })()}

                        {/* Observer Marker */}
                        <circle 
                            cx={center} 
                            cy={ latitude >= 0 ? center - (r * Math.sin(latitude * Math.PI / 180)) - 5 : center - (r * Math.sin(latitude * Math.PI / 180)) + 5 } 
                            r="3.5" 
                            fill="#ef4444" 
                            stroke="#fff" 
                            strokeWidth="1.5" 
                            filter="url(#glow)"
                        />
                        {/* Equatorial Plane - Draw on top */}
                        <ellipse cx={center} cy={center} rx={r + 30} ry={5} fill="none" stroke="#fcd34d" strokeWidth="0.5" opacity="0.4" />
                        <line x1={center - r - 30} y1={center} x2={center + r + 30} y2={center} stroke="#fcd34d" strokeWidth="1" opacity="0.4" />
                        
                        {/* Rotation Axis - Draw on top */}
                        <line 
                            x1={center} 
                            y1={center - r - 50} 
                            x2={center} 
                            y2={center + r + 50} 
                            stroke="#66d9ef" 
                            strokeWidth="2" 
                            strokeDasharray="5 3" 
                            opacity="0.6"
                        />
                        {/* North Pole Marker */}
                        <circle 
                            cx={center} 
                            cy={center - r - 50} 
                            r="4" 
                            fill="#66d9ef" 
                            stroke="#fff" 
                            strokeWidth="1"
                        />
                        <text 
                            x={center + 8} 
                            y={center - r - 48} 
                            fontSize="8" 
                            fill="#66d9ef" 
                            fontWeight="bold"
                        >N</text>
                        {/* South Pole Marker */}
                        <circle 
                            cx={center} 
                            cy={center + r + 50} 
                            r="4" 
                            fill="#66d9ef" 
                            stroke="#fff" 
                            strokeWidth="1"
                        />
                        <text 
                            x={center + 8} 
                            y={center + r + 53} 
                            fontSize="8" 
                            fill="#66d9ef" 
                            fontWeight="bold"
                        >S</text>
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