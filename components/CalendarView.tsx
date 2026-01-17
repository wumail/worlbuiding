import React, { useMemo } from 'react';
import { TERRAX_SYSTEM } from '../constants';
import { CalendarMonth } from '../types';

interface CalendarViewProps {
    currentDay: number;
    onDaySelect: (day: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ currentDay, onDaySelect }) => {
    const { months, remainderDays } = TERRAX_SYSTEM.calendar;

    // Helper to find which month/day the current global day falls into
    const getDateFromDay = (globalDay: number) => {
        let remaining = globalDay;
        
        // Check normal months
        for (const month of months) {
            if (remaining <= month.days) {
                return { monthId: month.id, day: remaining, isRemainder: false };
            }
            remaining -= month.days;
        }

        // Check remainder week
        if (remaining <= remainderDays) {
            return { monthId: -1, day: remaining, isRemainder: true }; // -1 for Remainder Week
        }
        
        // Fallback for end of year (shouldn't happen with clamped input)
        return { monthId: -1, day: remainderDays, isRemainder: true };
    };

    const currentDateInfo = useMemo(() => getDateFromDay(currentDay), [currentDay]);

    // Calculate start day for each month to allow clicking
    const getGlobalStartDay = (monthIndex: number) => {
        let count = 0;
        for(let i=0; i<monthIndex; i++) {
            count += months[i].days;
        }
        return count;
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-100">
                        {currentDateInfo.isRemainder ? 'Remainder Period' : `Month ${currentDateInfo.monthId}`}
                    </h3>
                    <p className="text-cyan-400 font-mono">
                        Day {currentDateInfo.day} / {currentDateInfo.isRemainder ? remainderDays : months[currentDateInfo.monthId - 1].days}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400">Global Day</div>
                    <div className="text-2xl font-mono text-white">{currentDay} <span className="text-sm text-slate-500">/ 513</span></div>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {months.map((month, idx) => {
                    const isCurrent = currentDateInfo.monthId === month.id;
                    const startDay = getGlobalStartDay(idx);
                    
                    return (
                        <button
                            key={month.id}
                            onClick={() => onDaySelect(startDay + 1)} // Jump to start of month
                            className={`p-3 rounded border text-left transition-all ${
                                isCurrent 
                                    ? 'bg-cyan-900/40 border-cyan-500 ring-1 ring-cyan-500' 
                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`}>
                                    M{month.id}
                                </span>
                                {month.isLong && (
                                    <span className="text-[10px] bg-slate-700 px-1 rounded text-slate-300">Long</span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500">{month.days} Days</div>
                        </button>
                    );
                })}
                
                {/* Remainder Days Button */}
                <button
                     onClick={() => onDaySelect(511)}
                     className={`p-3 rounded border text-left col-span-1 border-dashed ${
                        currentDateInfo.isRemainder
                            ? 'bg-purple-900/40 border-purple-500 ring-1 ring-purple-500' 
                            : 'bg-slate-800/30 border-slate-600 hover:border-slate-400'
                     }`}
                >
                    <div className="text-xs font-bold text-purple-400">Remainder</div>
                    <div className="text-xs text-slate-500">{remainderDays} Days</div>
                </button>
            </div>
            
            <div className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-2">
                * Calendar Structure: 13 Months. 10 Short (39d), 3 Long (40d). Ends with 3 Remainder Days (2 in Leap Years).
            </div>
        </div>
    );
};