import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import { TERRAX_SYSTEM } from '../constants';

interface EnvironmentalChartProps {
    currentDay: number;
    isLeapYear?: boolean;
}

export const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ currentDay, isLeapYear = false }) => {
    
    // --- Orbital Physics Implementation ---
    // Based on Kepler's equations as used in Artifexian's Solar Events Calculator
    const calculateSolarData = (day: number, totalDays: number) => {
        // Parameters from previous Desmos config
        const P = totalDays; // Orbital Period in local days
        const e = 0.0167; // Eccentricity
        const tiltDeg = 25; // Axial Tilt
        const wDeg = 283; // Longitude of Perihelion
        const latSin = 0.4069; // sin(latitude) -> approx 24 degrees N
        const rotationHours = 26;

        // Conversions
        const toRad = (deg: number) => deg * Math.PI / 180;
        const tiltRad = toRad(tiltDeg);
        const wRad = toRad(wDeg);
        const latRad = Math.asin(latSin);

        // 1. Mean Anomaly (M)
        // Assuming Day 1 is aligned roughly such that we calculate relative to start of year
        // We shift the day to align with Perihelion based on w.
        // Actually, let's follow the standard approximation where M goes 0->2PI over the year
        const M = (2 * Math.PI * (day - 1)) / P;

        // 2. True Anomaly (v) - Equation of Center (First order approx is usually sufficient for e=0.0167)
        // v = M + 2e*sin(M) + 1.25e^2*sin(2M)
        const v = M + (2 * e * Math.sin(M)) + (1.25 * e * e * Math.sin(2 * M));

        // 3. Solar Longitude (lambda)
        const lambda = v + wRad;

        // 4. Solar Declination (delta)
        const sinDelta = Math.sin(tiltRad) * Math.sin(lambda);
        const delta = Math.asin(sinDelta);

        // 5. Hour Angle (h)
        // cos(h) = -tan(phi) * tan(delta)
        // Clamped for polar days/nights
        let cosH = -Math.tan(latRad) * Math.tan(delta);
        cosH = Math.max(-1, Math.min(1, cosH));
        const h = Math.acos(cosH);

        // 6. Daylight Hours
        const daylightHours = (h / Math.PI) * rotationHours;

        return daylightHours;
    };

    // Generate data
    const data = React.useMemo(() => {
        const points = [];
        const yearLength = isLeapYear ? 512 : 513; 
        
        // Moon periods for Tide calculation
        const p1 = TERRAX_SYSTEM.moons[0].orbitalPeriodDays;
        const p2 = TERRAX_SYSTEM.moons[1].orbitalPeriodDays;

        // We step by 4 days to keep rendering performant while smooth enough
        for (let d = 1; d <= yearLength; d += 4) {
            
            const daylight = calculateSolarData(d, yearLength);

            // Tide Model (Constructive Interference)
            const tide1 = Math.cos((d / p1) * 2 * Math.PI);
            const tide2 = Math.cos((d / p2) * 2 * Math.PI);
            // Weighted sum: Luna (83%) + Echo (17%)
            const tideTotal = (tide1 * 0.83) + (tide2 * 0.17); 

            points.push({
                day: d,
                daylight: parseFloat(daylight.toFixed(2)),
                tide: parseFloat(Math.abs(tideTotal).toFixed(2)) 
            });
        }
        return points;
    }, [isLeapYear]);

    const currentPoint = calculateSolarData(currentDay, isLeapYear ? 512 : 513);

    return (
        <div className="w-full h-full bg-[#1f2833] rounded-xl shadow-lg border border-slate-700 flex flex-col p-4">
             <div className="flex items-center justify-between mb-2 flex-shrink-0 cursor-move drag-handle">
                <div>
                    <h4 className="text-sm font-semibold text-white">Environmental Cycles (Annual)</h4>
                    <p className="text-[10px] text-slate-500">Lat: ~24°N | Tilt: 25° | Rot: 26h</p>
                </div>
                <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1 text-yellow-400"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Daylight</span>
                    <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Tide</span>
                </div>
            </div>
            
            <div className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDaylight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fcd34d" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#fcd34d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                        <XAxis 
                            dataKey="day" 
                            stroke="#64748b" 
                            tick={{fontSize: 10}}
                            tickLine={false}
                        />
                        <YAxis 
                            yAxisId="left"
                            stroke="#64748b" 
                            tick={{fontSize: 10}} 
                            domain={['dataMin - 1', 'dataMax + 1']}
                            tickLine={false}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 1.2]}
                            hide
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px', color: '#f1f5f9' }}
                            itemStyle={{ padding: 0 }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
                        />
                        <ReferenceLine 
                            yAxisId="left"
                            x={currentDay} 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            strokeDasharray="3 3" 
                        />
                        
                        <Area 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="daylight" 
                            stroke="#fcd34d" 
                            fillOpacity={1} 
                            fill="url(#colorDaylight)" 
                            name="Daylight (Hours)"
                            strokeWidth={2}
                            activeDot={{ r: 4, fill: '#fcd34d' }}
                        />
                        <Area 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="tide" 
                            stroke="#22d3ee" 
                            fillOpacity={1} 
                            fill="url(#colorTide)" 
                            name="Tide Force"
                            strokeWidth={2}
                            activeDot={{ r: 4, fill: '#22d3ee' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
             <div className="flex justify-between text-xs mt-2 px-1 border-t border-slate-700 pt-2 flex-shrink-0">
                <span className="text-slate-400 font-mono">Current: <span className="text-yellow-400 font-bold">{currentPoint.toFixed(2)}h</span> Daylight</span>
            </div>
        </div>
    );
};