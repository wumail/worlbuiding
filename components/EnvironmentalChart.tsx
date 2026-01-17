import React from 'react';

interface EnvironmentalChartProps {
    currentDay: number;
    isLeapYear?: boolean;
}

export const EnvironmentalChart: React.FC<EnvironmentalChartProps> = () => {
    // URL provided for exact orbital parameter visualization via Artifexian's Desmos wrapper
    const chartUrl = "https://artifexian.github.io/SolarEvents/desmos.html?P=512.832783679207&w=283&d=26&e_{t}=25&s=0.406906236128608&e_{c}=0.0167&l_{s}=0";

    return (
        <div className="w-full bg-slate-900/50 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="text-sm font-semibold text-slate-400">Environmental Cycles (Annual)</h4>
                    <p className="text-[10px] text-slate-600 mt-1">
                        Source: Artifexian Solar Events Calculator (Desmos)
                    </p>
                </div>
            </div>
            
            {/* 
                Iframe Container 
                Increased height to 500px to ensure the Desmos interface/legend is legible.
                Background set to white as the external tool is light-themed.
            */}
            <div className="w-full h-[500px] bg-white rounded-lg overflow-hidden relative">
                <iframe 
                    src={chartUrl}
                    title="Solar Events Calculator"
                    className="w-full h-full border-0 block"
                    loading="lazy"
                    allowFullScreen
                />
            </div>
            
            <div className="flex justify-between text-xs mt-3 px-2 border-t border-slate-800 pt-3">
                <span className="text-slate-500 italic">
                    * Interactive synchronization disabled for external simulation.
                </span>
            </div>
        </div>
    );
};