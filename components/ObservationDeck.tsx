import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface ObservationDeckProps {
    simTime: number;
}

export const ObservationDeck: React.FC<ObservationDeckProps> = ({ simTime }) => {
    // Terrax Dynamics
    const tPeriod = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays * (TERRAX_SYSTEM.planet.rotationPeriodHours / 24); // in Earth Days
    const tAngle = ((simTime / tPeriod) * 2 * Math.PI); // Use simTime instead of currentDay
    const tRad = TERRAX_SYSTEM.planet.semiMajorAxisAU;

    const observations = TERRAX_SYSTEM.neighbors.map(planet => {
        // Planet Dynamics
        const pPeriod = planet.orbitalPeriodDays;
        const pAngle = ((simTime / pPeriod) * 2 * Math.PI);
        const pRad = planet.semiMajorAxisAU;

        // Coordinates (Sun at 0,0)
        const tx = tRad * Math.cos(tAngle);
        const ty = tRad * Math.sin(tAngle);
        const px = pRad * Math.cos(pAngle);
        const py = pRad * Math.sin(pAngle);

        // Vector from Terrax to Planet
        const dx = px - tx;
        const dy = py - ty;
        const distAU = Math.sqrt(dx*dx + dy*dy);

        // Phase Angle Approximation
        const phaseCos = (pRad*pRad + distAU*distAU - tRad*tRad) / (2 * pRad * distAU);
        const clampedCos = Math.max(-1, Math.min(1, phaseCos));
        const illumination = (1 + clampedCos) / 2;

        const rawBrightness = (planet.albedo * Math.pow(planet.radiusKm/1000, 2)) / (Math.pow(pRad, 2) * Math.pow(distAU, 2));
        const apparentBrightness = rawBrightness * illumination;

        const angleDiff = Math.abs(pAngle - tAngle) % (2*Math.PI);
        const isAligned = angleDiff < 0.2 || angleDiff > (2*Math.PI - 0.2);
        
        let status = "Visible";
        let statusColor = "text-cyan-400";
        if (isAligned) {
            if (pRad < tRad && Math.cos(angleDiff) > 0) {
                 status = "Inferior Conj."; 
                 statusColor = "text-slate-600";
            } else if (pRad < tRad) {
                 status = "Superior Conj."; 
                 statusColor = "text-slate-600";
            } else if (Math.cos(angleDiff) > 0) {
                 status = "Conjunction"; 
                 statusColor = "text-slate-600";
            } else {
                 status = "Opposition"; 
                 statusColor = "text-yellow-400 font-bold";
            }
        }

        return {
            name: planet.name.split(' ')[0],
            albedo: planet.albedo,
            distAU: distAU.toFixed(2),
            phasePct: (illumination * 100).toFixed(0),
            brightness: apparentBrightness,
            status,
            statusColor
        };
    }).sort((a,b) => b.brightness - a.brightness);

    return (
        <div className="w-full">
             <table className="w-full text-left text-xs border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-[#1f2833]">
                    <tr className="text-slate-500">
                        <th className="pb-3 pl-2 border-b border-slate-700 bg-[#1f2833]">Body</th>
                        <th className="pb-3 border-b border-slate-700 bg-[#1f2833]">Dist (AU)</th>
                        <th className="pb-3 border-b border-slate-700 bg-[#1f2833]">Phase</th>
                        <th className="pb-3 border-b border-slate-700 bg-[#1f2833]">Albedo</th>
                        <th className="pb-3 text-right pr-2 border-b border-slate-700 bg-[#1f2833]">Visibility</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {observations.map((obs) => (
                        <tr key={obs.name} className="group hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 pl-2 font-medium text-slate-300">{obs.name}</td>
                            <td className="py-3 text-slate-400 font-mono">{obs.distAU}</td>
                            <td className="py-3 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-600 overflow-hidden relative">
                                        <div 
                                            className="absolute top-0 bottom-0 bg-slate-200" 
                                            style={{
                                                left: 0, 
                                                right: `${100 - parseInt(obs.phasePct)}%`
                                            }}
                                        />
                                    </div>
                                    {obs.phasePct}%
                                </div>
                            </td>
                            <td className="py-3 text-slate-500">{obs.albedo}</td>
                            <td className={`py-3 text-right pr-2 ${obs.statusColor}`}>{obs.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};