import React, { useState } from 'react';
import { TERRAX_SYSTEM, METADATA } from './constants';
import { InfoCard } from './components/InfoCard';
import { PlanetaryOrrery } from './components/PlanetaryOrrery';
import { CalendarView } from './components/CalendarView';
import { EnvironmentalChart } from './components/EnvironmentalChart';
import { MoonPhaseDisplay } from './components/MoonPhaseDisplay';
import { SystemOrbitView } from './components/SystemOrbitView';
import { PlanetRotationView } from './components/PlanetRotationView';
import { ObservationDeck } from './components/ObservationDeck';
import { BookOpen, AlertTriangle, Calendar, Activity, Globe, Anchor, Clock, Telescope, ToggleLeft, ToggleRight } from 'lucide-react'; 

// Simple Icon Components
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconActivity = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconTelescope = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.536a.934.934 0 0 1 .702-1.108l6.18-1.318a.934.934 0 0 1 1.108.702l.537 2.536a.934.934 0 0 1-.702 1.108Z"/><path d="m13.482 10.622 3.746-1.591a.934.934 0 0 1 1.228.498l.635 1.517a.934.934 0 0 1-.498 1.228l-3.746 1.591"/><path d="M14.5 17.5 12 22l-2.5-4.5"/><path d="M7 22h10"/></svg>;

export default function App() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [timeOfDay, setTimeOfDay] = useState<number>(14); // Hours (0-26)
  const [isLeapYear, setIsLeapYear] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data'>('dashboard');

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDay(parseInt(e.target.value, 10));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeOfDay(parseInt(e.target.value, 10));
  };

  const totalDays = isLeapYear ? 512 : 513;

  const nextConjunction = React.useMemo(() => {
    const cycle = 85;
    const currentCycle = Math.ceil(currentDay / cycle);
    const nextDay = currentCycle * cycle;
    return nextDay;
  }, [currentDay]);

  const seasonInfo = React.useMemo(() => {
      if (currentDay < 128) {
          return { name: 'Vernal Season (Spring)', description: "Temperatures rising. Frequent rain in equatorial regions." };
      } else if (currentDay < 256) {
          return { name: 'Estival Season (Summer)', description: "Peak temperatures. Long days. High storm probability." };
      } else if (currentDay < 384) {
          return { name: 'Autumnal Season (Autumn)', description: "Cooling trends. Harvesting period. Stronger tides." };
      } else {
          return { name: 'Hibernal Season (Winter)', description: "Lowest temperatures. Short days. Dormancy period." };
      }
  }, [currentDay]);

  const moonPhases = React.useMemo(() => {
      const getPhase = (period: number) => {
          const rawPhase = ((currentDay / period) + 0.5) % 1.0;
          return rawPhase;
      };
      return {
          luna: getPhase(TERRAX_SYSTEM.moons[0].orbitalPeriodDays),
          echo: getPhase(TERRAX_SYSTEM.moons[1].orbitalPeriodDays)
      };
  }, [currentDay]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    <IconGlobe /> TERRAX <span className="text-cyan-500 font-light">SYSTEM OBSERVER</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                    Worldbuilding Co-Author Tool • Status: {METADATA.status} • Authority: {METADATA.authority.toUpperCase()}
                </p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                    Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('data')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'data' ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                    Raw Data
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column: Controls & Calendar */}
                <div className="xl:col-span-1 space-y-6">
                    
                    {/* Time Controls Panel */}
                    <div className="bg-[#1f2833] p-6 rounded-xl shadow-lg border border-slate-700 space-y-6">
                        {/* Day Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <IconActivity /> Day of Year
                                </h2>
                                <span className="text-cyan-400 font-mono text-sm">Day {currentDay} / {totalDays}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max={totalDays} 
                                value={currentDay} 
                                onChange={handleDayChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                         {/* Time Slider */}
                         <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <IconClock /> Local Time
                                </h2>
                                <span className="text-cyan-400 font-mono text-sm">{timeOfDay}:00 / 26:00</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="26" 
                                value={timeOfDay} 
                                onChange={handleTimeChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                         {/* Leap Year Toggle */}
                         <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                             <div className="text-sm font-semibold text-white">Year Type</div>
                             <button 
                                onClick={() => setIsLeapYear(!isLeapYear)}
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                             >
                                 {isLeapYear ? 'Leap Year (512d)' : 'Normal Year (513d)'}
                                 {isLeapYear ? <ToggleRight className="text-cyan-400 w-6 h-6" /> : <ToggleLeft className="text-slate-500 w-6 h-6" />}
                             </button>
                         </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Local Time" value={`${timeOfDay}:00`} subtext="26hr Cycle" />
                        <InfoCard label="Season" value={seasonInfo.name.split(' ')[0]} />
                        <InfoCard label="Solar Output" value="1.17" unit="Sol" />
                        <InfoCard label="Next Align." value={`Day ${nextConjunction}`} />
                    </div>

                    {/* Calendar View (Compact on large screens if needed, but we keep full width of col) */}
                    <CalendarView currentDay={currentDay} onDaySelect={setCurrentDay} isLeapYear={isLeapYear} />
                    
                    {/* Environmental Chart */}
                    <EnvironmentalChart currentDay={currentDay} />
                </div>

                {/* Right Column: Visuals (Spans 2 cols on wide screens) */}
                <div className="xl:col-span-2">
                    {/* Grid Container for Automatic Line Wrapping of Visual Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Module 1: System Map - Magnified */}
                        <div className="bg-[#1f2833] p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center md:col-span-2">
                            <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wider w-full border-b border-slate-700 pb-2 flex items-center gap-2">
                                <IconGlobe width={16} /> Helio-System
                            </h2>
                            <SystemOrbitView currentDay={currentDay} />
                        </div>

                        {/* Module 2: Planet Surface - Enhanced */}
                        <div className="bg-[#1f2833] p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center">
                             <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wider w-full border-b border-slate-700 pb-2 flex items-center gap-2">
                                <IconClock width={16} /> Terrax Rotation
                             </h2>
                             <PlanetRotationView currentDay={currentDay} timeOfDay={timeOfDay} />
                             <div className="mt-4 text-xs text-center text-slate-400 px-4">
                                {seasonInfo.description}
                             </div>
                        </div>

                        {/* Module 3: Moons */}
                        <div className="bg-[#1f2833] p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center">
                            <h2 className="text-sm font-bold text-white w-full mb-2 uppercase tracking-wider border-b border-slate-700 pb-2">Lunar System</h2>
                            <PlanetaryOrrery currentDay={currentDay} />
                            <div className="w-full space-y-2 mt-4">
                                 <MoonPhaseDisplay 
                                    moonName="Luna" 
                                    phase={moonPhases.luna} 
                                    period={TERRAX_SYSTEM.moons[0].orbitalPeriodDays}
                                    color="#e2e8f0"
                                />
                                <MoonPhaseDisplay 
                                    moonName="Echo" 
                                    phase={moonPhases.echo} 
                                    period={TERRAX_SYSTEM.moons[1].orbitalPeriodDays}
                                    color="#94a3b8"
                                />
                            </div>
                        </div>

                         {/* Module 4: Planetary Observations (New) */}
                         <div className="bg-[#1f2833] p-4 rounded-xl shadow-lg border border-slate-700 md:col-span-2">
                            <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wider border-b border-slate-700 pb-2 flex items-center gap-2">
                                <IconTelescope width={16} /> Observatory
                            </h2>
                            <ObservationDeck currentDay={currentDay} />
                            <div className="text-[10px] text-slate-500 mt-2 italic">
                                *Brightness calc based on Albedo & Distance relative to Terrax.
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-[#1f2833] p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <IconCalendar /> Source Material (YAML)
                </h2>
                <div className="grid gap-8">
                    <section>
                        <h3 className="text-cyan-400 font-mono mb-2 text-sm uppercase">Planet</h3>
                        <pre className="bg-[#0b0c10] p-4 rounded border border-slate-800 overflow-x-auto text-xs text-slate-300 font-mono">
                            {JSON.stringify(TERRAX_SYSTEM.planet, null, 2)}
                        </pre>
                    </section>
                    <section>
                        <h3 className="text-cyan-400 font-mono mb-2 text-sm uppercase">Neighbors</h3>
                        <pre className="bg-[#0b0c10] p-4 rounded border border-slate-800 overflow-x-auto text-xs text-slate-300 font-mono">
                            {JSON.stringify(TERRAX_SYSTEM.neighbors, null, 2)}
                        </pre>
                    </section>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}