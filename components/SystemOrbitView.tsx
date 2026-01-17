import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface SystemOrbitViewProps {
    simTime: number; 
}

export const SystemOrbitView: React.FC<SystemOrbitViewProps> = ({ simTime }) => {
    // Canvas size
    const size = 500;
    const center = size / 2;
    // Requirement 2: Reduced Sun radius to prevent overlap
    const sunRadius = 10;

    // Improved scaling logic to handle inner system better
    const scaleOrbit = (au: number) => {
        // Power scale (au^0.4) provides better spacing for both inner rocky and outer giants
        return Math.pow(au, 0.4) * 60 + 25;
    };

    const getPlanetPos = (au: number, periodDays: number, time: number) => {
        const angle = ((time / periodDays) * 2 * Math.PI) - (Math.PI / 2);
        const r = scaleOrbit(au);
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
            r,
            angle
        };
    };

    const terraxEarthDays = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays * (TERRAX_SYSTEM.planet.rotationPeriodHours / 24);
    const terraxPos = getPlanetPos(TERRAX_SYSTEM.planet.semiMajorAxisAU, terraxEarthDays, simTime);

    const neighborPositions = TERRAX_SYSTEM.neighbors.map(p => ({
        ...p,
        pos: getPlanetPos(p.semiMajorAxisAU, p.orbitalPeriodDays, simTime)
    }));

    return (
        <div className="flex flex-col items-center w-full overflow-hidden">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Sun */}
                    <circle cx={center} cy={center} r={sunRadius} fill="#fbbf24" filter="drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))" />
                    
                    {/* Neighbor Orbits and Planets */}
                    {neighborPositions.map((p) => (
                        <g key={p.name}>
                            <circle cx={center} cy={center} r={p.pos.r} fill="none" stroke="#334155" strokeWidth="1" opacity="0.2" strokeDasharray="3 3"/>
                            <circle 
                                cx={p.pos.x} 
                                cy={p.pos.y} 
                                r={p.type === 'Gas Giant' ? 8 : p.type === 'Ice Giant' ? 6 : 3.5} 
                                fill={p.color} 
                                stroke="#0b0c10"
                                strokeWidth="1"
                            />
                            {['Jove', 'Saturnus'].includes(p.name.split(' ')[0]) && (
                                <text x={p.pos.x + 10} y={p.pos.y} fontSize="11" fill={p.color} opacity="0.6" fontWeight="bold">{p.name[0]}</text>
                            )}
                        </g>
                    ))}

                    {/* Terrax Orbit and Planet */}
                    <circle cx={center} cy={center} r={terraxPos.r} fill="none" stroke="#45a29e" strokeWidth="1.5" opacity="0.4" />
                    <circle cx={terraxPos.x} cy={terraxPos.y} r={6} fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />
                    <text x={terraxPos.x + 10} y={terraxPos.y} fontSize="12" fill="#22d3ee" fontWeight="bold">Terrax</text>
                    
                    <text x={center} y={size - 10} textAnchor="middle" fill="#475569" fontSize="10" opacity="0.5">Independent Physical Orrery</text>
                </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4 px-3 bg-slate-900/80 p-2 rounded-full border border-slate-700/50">
                <span className="flex items-center text-[10px] text-slate-300 gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Terrax</span>
                {neighborPositions.map(n => (
                    <span key={n.name} className="flex items-center text-[10px] text-slate-400 gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: n.color}}></span>
                        {n.name.split(' ')[0]}
                    </span>
                ))}
            </div>
        </div>
    );
};