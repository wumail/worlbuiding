import React, { useState } from 'react';
import { TERRAX_SYSTEM, METADATA } from './constants';
import { InfoCard } from './components/InfoCard';
import { PlanetaryOrrery } from './components/PlanetaryOrrery';
import { CalendarView } from './components/CalendarView';
import { EnvironmentalChart } from './components/EnvironmentalChart';
import { MoonPhaseDisplay } from './components/MoonPhaseDisplay';
import { BookOpen, AlertTriangle, Calendar, Activity, Globe, Anchor } from 'lucide-react'; // Assuming lucide-react is available or I simulate icon usage with SVGs if needed.

// Simple Icon Components (Keep existing)
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconActivity = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;

export default function App() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data'>('dashboard');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDay(parseInt(e.target.value, 10));
  };

  const nextConjunction = React.useMemo(() => {
    // A simplified tracker for the "85 day" cycle mentioned in text
    // Cycle starts at day 0? Assuming yes for simulation.
    const cycle = 85;
    const currentCycle = Math.ceil(currentDay / cycle);
    const nextDay = currentCycle * cycle;
    return nextDay;
  }, [currentDay]);

  const seasonInfo = React.useMemo(() => {
      // 513 days total. 4 Seasons ~ 128 days.
      // Day 0 (or 513) = Spring Equinox
      // 0-128: Spring
      // 129-256: Summer
      // 257-384: Autumn
      // 385-513: Winter
      
      let name = "";
      let description = "";
      
      if (currentDay < 128) {
          name = 'Vernal Season (Spring)';
          description = "Temperatures rising. Frequent rain in equatorial regions.";
      } else if (currentDay < 256) {
          name = 'Estival Season (Summer)';
          description = "Peak temperatures. Long days. High storm probability.";
      } else if (currentDay < 384) {
          name = 'Autumnal Season (Autumn)';
          description = "Cooling trends. Harvesting period. Stronger tides.";
      } else {
          name = 'Hibernal Season (Winter)';
          description = "Lowest temperatures. Short days. Dormancy period.";
      }
      return { name, description };
  }, [currentDay]);

  const moonPhases = React.useMemo(() => {
      const getPhase = (period: number) => {
          // Orrery logic: Top (-90deg) = Full. Bottom (90deg) = New.
          // We calculate angle relative to Sun (Bottom).
          // Phase 0 = New. Phase 0.5 = Full.
          
          // Current logic in Orrery:
          // angle = ((day % period) / period) * 2 PI - PI/2.
          // At day 0: -PI/2.
          // If we want Day 0 to be New Moon (Phase 0), we need Angle to be PI/2.
          // So let's shift by 0.5 period? 
          // Actually, let's just calc phase based on existing Orrery positions.
          // Day 0 -> Full (Phase 0.5).
          // So Phase = ((Day / Period) + 0.5) % 1.0.
          
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Controls & Calendar */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Time Control */}
                    <div className="bg-[#1f2833] p-6 rounded-xl shadow-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <IconActivity /> Temporal Controls
                            </h2>
                            <span className="text-cyan-400 font-mono text-sm">Day {currentDay} / 513</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="513" 
                            value={currentDay} 
                            onChange={handleSliderChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                            <span>Year Start (Spring)</span>
                            <span>Mid-Year (Autumn)</span>
                            <span>Year End (Winter)</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <InfoCard label="Local Time" value="14:00" subtext="26hr Cycle" />
                        <InfoCard label="Next Alignment" value={`Day ${nextConjunction}`} subtext={`in ${nextConjunction - currentDay} days`} />
                        <InfoCard label="Solar Output" value="1.17" unit="Sol" />
                        <InfoCard label="Atmosphere" value={`${TERRAX_SYSTEM.planet.atmosphere.pressureAtm} atm`} unit="N2/O2" />
                    </div>

                    {/* Calendar View */}
                    <CalendarView currentDay={currentDay} onDaySelect={setCurrentDay} />

                    {/* Environmental Chart */}
                    <EnvironmentalChart currentDay={currentDay} />
                </div>

                {/* Right Column: Visuals & Details */}
                <div className="space-y-6">
                    
                    {/* Orrery */}
                    <div className="bg-[#1f2833] p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-white w-full mb-4 border-b border-slate-700 pb-2">Orbital Dynamics</h2>
                        <PlanetaryOrrery currentDay={currentDay} />
                    </div>

                    {/* Sky Status (New Section) */}
                    <div className="bg-[#1f2833] p-6 rounded-xl shadow-lg border border-slate-700">
                        <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                             Current Sky
                        </h2>
                        
                        {/* Season Status */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-yellow-400 mb-1">
                                <IconSun />
                                <span className="font-bold">{seasonInfo.name}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {seasonInfo.description}
                            </p>
                        </div>

                        {/* Moon Phases */}
                        <div className="space-y-3">
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

                     {/* Constraints Warning */}
                     <div className="bg-orange-950/20 p-4 rounded-lg border border-orange-900/50">
                        <div className="flex items-start gap-3">
                            <IconAlert />
                            <div>
                                <h4 className="text-orange-400 text-sm font-bold">Co-Author Note</h4>
                                <p className="text-xs text-orange-200/70 mt-1">
                                    Current tidal calculations are estimations. The "Resonance Alignment" creates extreme tides every ~85 days. Ensure narrative consistency when moving characters during these windows.
                                </p>
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
                        <h3 className="text-cyan-400 font-mono mb-2 text-sm uppercase">Star</h3>
                        <pre className="bg-[#0b0c10] p-4 rounded border border-slate-800 overflow-x-auto text-xs text-slate-300 font-mono">
                            {JSON.stringify(TERRAX_SYSTEM.star, null, 2)}
                        </pre>
                    </section>
                    <section>
                        <h3 className="text-cyan-400 font-mono mb-2 text-sm uppercase">Moons</h3>
                        <pre className="bg-[#0b0c10] p-4 rounded border border-slate-800 overflow-x-auto text-xs text-slate-300 font-mono">
                            {JSON.stringify(TERRAX_SYSTEM.moons, null, 2)}
                        </pre>
                    </section>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}