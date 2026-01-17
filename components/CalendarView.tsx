import React, { useMemo } from 'react';
import { TERRAX_SYSTEM } from '../constants';
import { CalendarMonth } from '../types';

interface CalendarViewProps {
    currentDay: number;
    onDaySelect: (day: number) => void;
    isLeapYear: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ currentDay, onDaySelect, isLeapYear }) => {
    const { months, remainderDays, leapYearRemainder } = TERRAX_SYSTEM.calendar;
    
    const activeRemainderDays = isLeapYear ? leapYearRemainder : remainderDays;
    const totalDaysInYear = isLeapYear ? 512 : 513;

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
        if (remaining <= activeRemainderDays) {
            return { monthId: -1, day: remaining, isRemainder: true }; // -1 for Remainder Week
        }
        
        // Fallback for end of year
        return { monthId: -1, day: activeRemainderDays, isRemainder: true };
    };

    const currentDateInfo = useMemo(() => getDateFromDay(currentDay), [currentDay, isLeapYear]);

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
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-100">
                            {currentDateInfo.isRemainder ? 'Remainder Period' : `Month ${currentDateInfo.monthId}`}
                        </h3>
                        {isLeapYear && <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-700 uppercase">Leap Year</span>}
                    </div>
                    <p className="text-cyan-400 font-mono">
                        Day {currentDateInfo.day} / {currentDateInfo.isRemainder ? activeRemainderDays : months[currentDateInfo.monthId - 1].days}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400">Global Day</div>
                    <div className="text-2xl font-mono text-white">{currentDay} <span className="text-sm text-slate-500">/ {totalDaysInYear}</span></div>
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
                     onClick={() => onDaySelect(totalDaysInYear - activeRemainderDays + 1)}
                     className={`p-3 rounded border text-left col-span-1 border-dashed ${
                        currentDateInfo.isRemainder
                            ? 'bg-purple-900/40 border-purple-500 ring-1 ring-purple-500' 
                            : 'bg-slate-800/30 border-slate-600 hover:border-slate-400'
                     }`}
                >
                    <div className="text-xs font-bold text-purple-400">Remainder</div>
                    <div className="text-xs text-slate-500">{activeRemainderDays} Days</div>
                </button>
            </div>
            
            <div className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-2">
                * Calendar Structure: 13 Months. 10 Short (39d), 3 Long (40d). Ends with {activeRemainderDays} Remainder Days.
            </div>
        </div>
    );
};