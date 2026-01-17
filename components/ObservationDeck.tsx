import React from 'react';
import { TERRAX_SYSTEM } from '../constants';

interface ObservationDeckProps {
    currentDay: number;
}

export const ObservationDeck: React.FC<ObservationDeckProps> = ({ currentDay }) => {
    // Terrax Dynamics
    const tPeriod = TERRAX_SYSTEM.planet.orbitalPeriodLocalDays * (TERRAX_SYSTEM.planet.rotationPeriodHours / 24); // in Earth Days
    const tAngle = ((currentDay / tPeriod) * 2 * Math.PI); // Angle in orbit
    const tRad = TERRAX_SYSTEM.planet.semiMajorAxisAU;

    const observations = TERRAX_SYSTEM.neighbors.map(planet => {
        // Planet Dynamics
        const pPeriod = planet.orbitalPeriodDays;
        const pAngle = ((currentDay / pPeriod) * 2 * Math.PI);
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

        // Phase Angle (Earth-Sun-Planet angle roughly, simplified)
        // Cos(Phase) = (r^2 + d^2 - R^2) / (2rd)
        // r = sun-planet dist, d = earth-planet dist, R = sun-earth dist
        // Using Law of Cosines
        const phaseCos = (pRad*pRad + distAU*distAU - tRad*tRad) / (2 * pRad * distAU);
        // Clamp for safety
        const clampedCos = Math.max(-1, Math.min(1, phaseCos));
        const phase = Math.acos(clampedCos); // Radians. 0 = Full (Opposition), PI = New (Conjunction) for Superior planets? 
        // Note: For Superior planets, Full is at Opposition. For Inferior, phases match moon.
        // We will use % Illumination = (1 + cos(phase))/2 for simplicity.
        const illumination = (1 + clampedCos) / 2;

        // Apparent Magnitude Approximation
        // Mag = -2.5 * log10( (Albedo * Radius^2 * PhaseFunc) / (DistToSun^2 * DistToObserver^2) ) + Constant
        // Simplified Logic for UI comparison:
        // Brightness Score = (Albedo * (Radius/1000)^2) / (pRad^2 * distAU^2)
        // Multiplied by Illumination
        const rawBrightness = (planet.albedo * Math.pow(planet.radiusKm/1000, 2)) / (Math.pow(pRad, 2) * Math.pow(distAU, 2));
        const apparentBrightness = rawBrightness * illumination;

        // Visibility Text
        let visibility = "Visible";
        if (pRad < tRad) {
            // Inner Planet
            // If near Sun (angle diff small), invisible
        } else {
            // Outer Planet
            // If near Sun (Conjunction), invisible
        }
        
        // Relative Angle difference for conjunction/opposition check
        const angleDiff = Math.abs(pAngle - tAngle) % (2*Math.PI);
        const isAligned = angleDiff < 0.2 || angleDiff > (2*Math.PI - 0.2);
        
        // Determine Status
        let status = "Visible";
        let statusColor = "text-cyan-400";
        if (isAligned) {
            if (pRad < tRad && Math.cos(angleDiff) > 0) {
                 status = "Inferior Conj."; // Between Earth and Sun
                 statusColor = "text-slate-600";
            } else if (pRad < tRad) {
                 status = "Superior Conj."; // Behind Sun
                 statusColor = "text-slate-600";
            } else if (Math.cos(angleDiff) > 0) {
                 status = "Conjunction"; // Behind Sun
                 statusColor = "text-slate-600";
            } else {
                 status = "Opposition"; // Opposite Sun (Best View)
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
    }).sort((a,b) => b.brightness - a.brightness); // Sort by brightest

    return (
        <div className="overflow-x-auto">
             <table className="w-full text-left text-xs">
                <thead>
                    <tr className="border-b border-slate-700 text-slate-500">
                        <th className="pb-2 pl-2">Body</th>
                        <th className="pb-2">Dist (AU)</th>
                        <th className="pb-2">Phase</th>
                        <th className="pb-2">Albedo</th>
                        <th className="pb-2 text-right pr-2">Visibility</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {observations.map((obs) => (
                        <tr key={obs.name} className="group hover:bg-slate-800/50 transition-colors">
                            <td className="py-2 pl-2 font-medium text-slate-300">{obs.name}</td>
                            <td className="py-2 text-slate-400 font-mono">{obs.distAU}</td>
                            <td className="py-2 text-slate-400">
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
                            <td className="py-2 text-slate-500">{obs.albedo}</td>
                            <td className={`py-2 text-right pr-2 ${obs.statusColor}`}>{obs.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};