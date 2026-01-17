import React from 'react';

interface MoonPhaseDisplayProps {
    moonName: string;
    phase: number; // 0.0 to 1.0 (0=New, 0.5=Full)
    period: number;
    color: string;
}

export const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({ moonName, phase, period, color }) => {
    
    const getPhaseName = (p: number) => {
        if (p < 0.05 || p > 0.95) return "New Moon";
        if (p < 0.20) return "Waxing Crescent";
        if (p < 0.30) return "First Quarter";
        if (p < 0.45) return "Waxing Gibbous";
        if (p < 0.55) return "Full Moon";
        if (p < 0.70) return "Waning Gibbous";
        if (p < 0.80) return "Last Quarter";
        return "Waning Crescent";
    };

    const phaseName = getPhaseName(phase);

    // Render logic
    const size = 60;
    const r = 26;
    const cx = 30;
    const cy = 30;

    // Visualizing the phase shadow
    // We draw a full circle of the moon color.
    // Then we draw a semi-circle shadow on one side.
    // Then an ellipse shadow/light to handle the gibbous/crescent part.
    
    // Simplification:
    // Waxing (0 -> 0.5): Light is on Right. Shadow is Left.
    // Waning (0.5 -> 1): Light is on Left. Shadow is Right.
    
    const isWaxing = phase <= 0.5;
    // Illumination 0..1
    // If Waxing: 0 -> 1. If Waning: 1 -> 0.
    const illumination = isWaxing ? phase * 2 : (1 - phase) * 2;
    
    return (
        <div className="flex items-center space-x-4 bg-slate-800/40 p-3 rounded-lg border border-slate-700">
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox="0 0 60 60">
                    {/* Background (Dark Side) */}
                    <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#334155" strokeWidth="1" />
                    
                    {/* Lit Side Masking */}
                    <mask id={`phase-mask-${moonName}`}>
                        <rect x="0" y="0" width="60" height="60" fill="black" />
                        {/* Draw the lit area white */}
                        {/* First, half circle */}
                        <path d={`M ${cx},${cy-r} A ${r},${r} 0 0,${isWaxing ? 1 : 0} ${cx},${cy+r} Z`} fill="white" />
                        {/* Then the elliptic part */}
                        <ellipse 
                            cx={cx} 
                            cy={cy} 
                            rx={r * (Math.abs(illumination - 0.5) * 2)} 
                            ry={r} 
                            fill={illumination < 0.5 ? "black" : "white"} 
                        />
                    </mask>
                    
                    <circle cx={cx} cy={cy} r={r} fill={color} mask={`url(#phase-mask-${moonName})`} />
                </svg>
            </div>
            <div>
                <div className="text-xs text-slate-400 font-bold uppercase">{moonName}</div>
                <div className="text-sm font-semibold text-cyan-100">{phaseName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{(illumination * 100).toFixed(0)}% Illuminated</div>
            </div>
        </div>
    );
};