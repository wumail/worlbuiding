import React from 'react';

interface InfoCardProps {
    label: string;
    value: string | number;
    unit?: string;
    highlight?: boolean;
    subtext?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value, unit, highlight = false, subtext }) => {
    return (
        <div className={`p-4 rounded-lg border ${highlight ? 'border-cyan-500 bg-cyan-950/30' : 'border-slate-700 bg-slate-800/50'}`}>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</div>
            <div className={`text-2xl font-bold font-mono ${highlight ? 'text-cyan-400' : 'text-slate-100'}`}>
                {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
            </div>
            {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
        </div>
    );
};