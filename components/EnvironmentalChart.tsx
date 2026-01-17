import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { TERRAX_SYSTEM } from '../constants';
import { Activity, MapPin } from 'lucide-react';

interface EnvironmentalChartProps {
    currentDay: number;
    isLeapYear?: boolean;
    latitude?: number;
    onLatitudeChange?: (lat: number) => void;
}

export const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ 
    isLeapYear = false, 
    latitude = 24, 
    onLatitudeChange 
}) => {
    
    const calculateEnvironment = (day: number, totalDays: number, lat: number) => {
        const P = totalDays; 
        const e = 0.0167; 
        const tiltDeg = 25; 
        const wDeg = 283; 
        const rotationHours = 26;

        const toRad = (deg: number) => deg * Math.PI / 180;
        const tiltRad = toRad(tiltDeg);
        const wRad = toRad(wDeg);
        const latRad = toRad(lat);

        const M = (2 * Math.PI * (day - 1)) / P;
        const v = M + (2 * e - Math.pow(e, 3)/4) * Math.sin(M) + (1.25 * e * e) * Math.sin(2 * M);
        const lambda = v + wRad;
        const sinDelta = Math.sin(tiltRad) * Math.sin(lambda);
        const delta = Math.asin(sinDelta);

        let cosH = -Math.tan(latRad) * Math.tan(delta);
        cosH = Math.max(-1, Math.min(1, cosH)); 
        const h = Math.acos(cosH);
        const daylightHours = (h / Math.PI) * rotationHours;

        return daylightHours;
    };

    const data = React.useMemo(() => {
        const points = [];
        const yearLength = isLeapYear ? 512 : 513; 
        const p1 = TERRAX_SYSTEM.moons[0].orbitalPeriodDays; 
        const p2 = TERRAX_SYSTEM.moons[1].orbitalPeriodDays; 

        for (let d = 1; d <= yearLength; d += 4) { 
            const daylight = calculateEnvironment(d, yearLength, latitude);
            const phase1 = (d / p1) * 2 * Math.PI;
            const phase2 = (d / p2) * 2 * Math.PI;
            const tideForce = (Math.cos(phase1) * 0.83) + (Math.cos(phase2) * 0.17);

            points.push({
                day: d,
                daylight: parseFloat(daylight.toFixed(2)),
                tide: parseFloat((Math.abs(tideForce)).toFixed(2)) 
            });
        }
        return points;
    }, [isLeapYear, latitude]);

    return (
        <div className="w-full h-full bg-[#1f2833]/40 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col p-6 overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 flex-shrink-0 drag-handle cursor-move gap-4">
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity size={14} className="text-yellow-400" /> Annual Environmental Rhythm
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Keplerian Motion Analysis</p>
                </div>
                
                {onLatitudeChange && (
                    <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
                        <MapPin size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-mono text-emerald-400 w-12">{latitude}°{latitude >= 0 ? 'N' : 'S'}</span>
                        <input 
                            type="range" min="-90" max="90" value={latitude} 
                            onChange={(e) => onLatitudeChange(parseInt(e.target.value))}
                            className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                )}

                <div className="text-right">
                    <span className="block text-[10px] text-slate-500 uppercase">Season Cycle</span>
                    <span className="text-lg font-mono font-bold text-yellow-400">{isLeapYear ? '512' : '513'} Days</span>
                </div>
            </div>
            
            <div className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradDaylight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fcd34d" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#fcd34d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="gradTide" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                        <XAxis dataKey="day" stroke="#475569" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#475569" tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 26]} tickLine={false} axisLine={false} />
                        
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', fontSize: '12px' }}
                            labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        
                        <Area yAxisId="left" type="monotone" dataKey="daylight" stroke="#fcd34d" strokeWidth={3} fillOpacity={1} fill="url(#gradDaylight)" name="Daylight Hours" />
                        <Area yAxisId="left" type="monotone" dataKey="tide" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#gradTide)" name="Tidal Force (Relative)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};