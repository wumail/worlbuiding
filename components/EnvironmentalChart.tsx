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
}

export const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ currentDay }) => {
    // Generate data points for the year
    const data = React.useMemo(() => {
        const points = [];
        const yearLength = 513; 
        const axialTiltRad = (TERRAX_SYSTEM.planet.axialTilt * Math.PI) / 180;
        
        // Moon periods
        const p1 = TERRAX_SYSTEM.moons[0].orbitalPeriodDays;
        const p2 = TERRAX_SYSTEM.moons[1].orbitalPeriodDays;

        for (let d = 1; d <= yearLength; d += 5) {
            // Simplified Daylight Model (Sinusoidal)
            const seasonPhase = (d / yearLength) * 2 * Math.PI;
            const daylightHours = 26/2 + (Math.sin(seasonPhase) * (axialTiltRad * 2)); 

            // Simplified Tide Model
            const tide1 = Math.cos((d / p1) * 2 * Math.PI);
            const tide2 = Math.cos((d / p2) * 2 * Math.PI);
            const tideTotal = (tide1 * 0.83) + (tide2 * 0.17); 

            points.push({
                day: d,
                daylight: parseFloat(daylightHours.toFixed(2)),
                tide: parseFloat(Math.abs(tideTotal).toFixed(2)) 
            });
        }
        return points;
    }, []);

    // Calculate current specific values
    const currentPoint = data.find(p => p.day >= currentDay) || data[data.length - 1];

    return (
        <div className="w-full bg-slate-900/50 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-slate-400">Environmental Cycles (Annual)</h4>
                <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1 text-yellow-500"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Daylight</span>
                    <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Tide</span>
                </div>
            </div>
            
            {/* Height is defined here, width follows container */}
            <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDaylight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fcd34d" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#fcd34d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                            dataKey="day" 
                            stroke="#64748b" 
                            tick={{fontSize: 11}}
                            label={{ value: 'Day of Year', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 11 }}
                        />
                        <YAxis stroke="#64748b" tick={{fontSize: 11}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                            itemStyle={{ padding: 0 }}
                        />
                        <ReferenceLine x={currentDay} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'NOW', fill: '#ef4444', fontSize: 10 }} />
                        
                        <Area 
                            type="monotone" 
                            dataKey="daylight" 
                            stroke="#fcd34d" 
                            fillOpacity={1} 
                            fill="url(#colorDaylight)" 
                            name="Daylight Hours"
                            strokeWidth={2}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="tide" 
                            stroke="#06b6d4" 
                            fillOpacity={1} 
                            fill="url(#colorTide)" 
                            name="Tidal Force (Rel)" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-xs mt-2 px-2 border-t border-slate-800 pt-3">
                <span className="text-slate-400 font-mono">Daylight: <span className="text-white text-sm font-bold">{currentPoint?.daylight}h</span></span>
                <span className="text-slate-400 font-mono">Tide Intensity: <span className="text-white text-sm font-bold">{(currentPoint?.tide * 100).toFixed(0)}%</span></span>
            </div>
        </div>
    );
};