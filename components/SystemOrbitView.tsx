import React, { useState, useEffect, useRef } from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface SystemOrbitViewProps {
    currentDay: number; // Prop remains for interface compatibility but is no longer the primary driver
}

export const SystemOrbitView: React.FC<SystemOrbitViewProps> = () => {
    // Canvas size
    const size = 500;
    const center = size / 2;
    const sunRadius = 18;

    // Internal simulation time that does not wrap at 513 days
    const [simTime, setSimTime] = useState(0);
    const lastTickRef = useRef<number>(performance.now());

    useEffect(() => {
        let frameId: number;
        const tick = (now: number) => {
            const dt = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;
            // Speed factor: 1 real second = 5 simulation days
            setSimTime(prev => prev + dt * 5);
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const scaleOrbit = (au: number) => {
        const minAu = 0.2; 
        const maxLog = Math.log(35); 
        const availRadius = (size / 2) - 40; 
        return (Math.log(au + minAu) / maxLog) * availRadius + 25; 
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
                    <circle cx={center} cy={center} r={sunRadius} fill="#fbbf24" filter="drop-shadow(0 0 20px rgba(251, 191, 36, 0.7))" />
                    
                    {neighborPositions.map((p) => (
                        <g key={p.name}>
                            <circle cx={center} cy={center} r={p.pos.r} fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" strokeDasharray="3 3"/>
                            <circle 
                                cx={p.pos.x} 
                                cy={p.pos.y} 
                                r={p.type === 'Gas Giant' ? 8 : p.type === 'Ice Giant' ? 6 : 3.5} 
                                fill={p.color} 
                                stroke="#0b0c10"
                                strokeWidth="1"
                            />
                            {['Jove', 'Saturnus'].includes(p.name.split(' ')[0]) && (
                                <text x={p.pos.x + 10} y={p.pos.y} fontSize="11" fill={p.color} opacity="0.8" fontWeight="bold">{p.name[0]}</text>
                            )}
                        </g>
                    ))}

                    <circle cx={center} cy={center} r={terraxPos.r} fill="none" stroke="#45a29e" strokeWidth="2" opacity="0.5" />
                    <circle cx={terraxPos.x} cy={terraxPos.y} r={6} fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />
                    <text x={terraxPos.x + 10} y={terraxPos.y} fontSize="12" fill="#22d3ee" fontWeight="bold">Terrax</text>
                    
                    <text x={center} y={size - 10} textAnchor="middle" fill="#475569" fontSize="10">Independent Real-Time Simulation</text>
                </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4 px-2 bg-slate-900/50 p-2 rounded-full border border-slate-800">
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