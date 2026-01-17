import React, { useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { TERRAX_SYSTEM, METADATA } from './constants';
import { InfoCard } from './components/InfoCard';
import { PlanetaryOrrery } from './components/PlanetaryOrrery';
import { CalendarView } from './components/CalendarView';
import { EnvironmentalChart } from './components/EnvironmentalChart';
import { MoonPhaseDisplay } from './components/MoonPhaseDisplay';
import { SystemOrbitView } from './components/SystemOrbitView';
import { PlanetRotationView } from './components/PlanetRotationView';
import { ObservationDeck } from './components/ObservationDeck';
import { ToggleLeft, ToggleRight, LayoutDashboard, Database, Globe, Activity, Clock, Telescope, Calendar, Play, Pause, FastForward } from 'lucide-react'; 

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'rot', x: 0, y: 0, w: 6, h: 7, minW: 4, minH: 6 },
    { i: 'lunar', x: 6, y: 0, w: 6, h: 7, minW: 4, minH: 6 },
    { i: 'env', x: 0, y: 7, w: 12, h: 7, minW: 6, minH: 6 },
    { i: 'helio', x: 0, y: 14, w: 6, h: 6, minW: 4, minH: 5 },
    { i: 'obs', x: 6, y: 14, w: 6, h: 6, minW: 4, minH: 5 },
  ],
  md: [
    { i: 'rot', x: 0, y: 0, w: 5, h: 7, minW: 4, minH: 6 },
    { i: 'lunar', x: 5, y: 0, w: 5, h: 7, minW: 4, minH: 6 },
    { i: 'env', x: 0, y: 7, w: 10, h: 7, minW: 6, minH: 6 },
    { i: 'helio', x: 0, y: 14, w: 5, h: 6, minW: 4, minH: 5 },
    { i: 'obs', x: 5, y: 14, w: 5, h: 6, minW: 4, minH: 5 },
  ],
  sm: [
    { i: 'rot', x: 0, y: 0, w: 6, h: 6 },
    { i: 'lunar', x: 0, y: 6, w: 6, h: 6 },
    { i: 'env', x: 0, y: 12, w: 6, h: 7 },
    { i: 'helio', x: 0, y: 19, w: 6, h: 6 },
    { i: 'obs', x: 0, y: 25, w: 6, h: 6 },
  ]
};

export default function App() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [timeOfDay, setTimeOfDay] = useState<number>(14); 
  const [isLeapYear, setIsLeapYear] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number>(24); 
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data'>('dashboard');
  
  // Animation/Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); 
  const [simTime, setSimTime] = useState<number>(0); // Shared orbital simulation clock
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (isPlaying) {
        const now = Date.now();
        const delta = (now - lastUpdateRef.current) / 1000; // in seconds
        lastUpdateRef.current = now;
        
        const speedMultiplier = simSpeed * 5;

        // Update Calendar Time
        setCurrentDay(prev => {
          const total = isLeapYear ? 512 : 513;
          let next = prev + (delta * speedMultiplier); 
          if (next > total) next = 1;
          return next;
        });

        // Update Independent Orbital Time
        setSimTime(prev => prev + (delta * speedMultiplier));
      } else {
        lastUpdateRef.current = Date.now();
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, simSpeed, isLeapYear]);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDay(parseFloat(e.target.value));
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
      if (currentDay < 128) return { name: 'Vernal (Spring)', color: 'text-green-400' };
      if (currentDay < 256) return { name: 'Estival (Summer)', color: 'text-yellow-400' };
      if (currentDay < 384) return { name: 'Autumnal (Autumn)', color: 'text-orange-400' };
      return { name: 'Hibernal (Winter)', color: 'text-blue-400' };
  }, [currentDay]);

  const moonPhases = React.useMemo(() => {
      const getPhase = (period: number) => ((currentDay / period) + 0.5) % 1.0;
      return {
          luna: getPhase(TERRAX_SYSTEM.moons[0].orbitalPeriodDays),
          echo: getPhase(TERRAX_SYSTEM.moons[1].orbitalPeriodDays)
      };
  }, [currentDay]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-cyan-500/30">
      <nav className="sticky top-0 z-50 bg-[#0b0c10]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                    <Globe className="text-cyan-400 w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        TERRAX <span className="text-cyan-500 font-extralight tracking-widest">OBSERVER</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Authority: {METADATA.authority} • v1.5.1</p>
                </div>
            </div>
            
            <div className="flex items-center bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <LayoutDashboard size={16} /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('data')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'data' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Database size={16} /> Data Hub
                </button>
            </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-[#1f2833]/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Temporal Flow</label>
                            <div className="flex gap-2">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400">
                                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <button onClick={() => setSimSpeed(s => s === 5 ? 1 : s + 2)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400">
                                    <FastForward size={14} className={simSpeed > 1 ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Activity size={16} className="text-cyan-400" /> Global Day
                                </label>
                                <span className="px-3 py-1 bg-slate-900 rounded-full text-cyan-400 font-mono text-xs border border-slate-700">
                                    DAY {Math.floor(currentDay)}
                                </span>
                            </div>
                            <input 
                                type="range" min="1" max={totalDays} step="0.1" value={currentDay} onChange={handleDayChange}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                            />
                        </div>

                         <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Clock size={16} className="text-indigo-400" /> Time (Rot.)
                                </label>
                                <span className="px-3 py-1 bg-slate-900 rounded-full text-indigo-400 font-mono text-xs border border-slate-700">
                                    {timeOfDay}:00 / 26h
                                </span>
                            </div>
                            <input 
                                type="range" min="0" max="26" value={timeOfDay} onChange={handleTimeChange}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                        </div>

                         <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orbital Sync</div>
                             <button 
                                onClick={() => setIsLeapYear(!isLeapYear)}
                                className="group flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all"
                             >
                                 <span className="font-mono">{isLeapYear ? 'LEAP' : 'REG'}</span>
                                 {isLeapYear ? <ToggleRight className="text-cyan-400 w-5 h-5" /> : <ToggleLeft className="text-slate-600 w-5 h-5" />}
                             </button>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Season" value={seasonInfo.name} highlight subtext="Annual Cycle" />
                        <InfoCard label="Solar Flux" value="1.17" unit="L☉" />
                        <InfoCard label="Axial Tilt" value="25.0" unit="°" />
                        <InfoCard label="Tidal Force" value="Sync" unit="Force" highlight={nextConjunction - currentDay < 5} />
                    </div>

                    <div className="bg-[#1f2833]/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                         <CalendarView currentDay={Math.floor(currentDay)} onDaySelect={setCurrentDay} isLeapYear={isLeapYear} />
                    </div>
                </div>

                <div className="xl:col-span-9">
                    <ResponsiveGridLayout 
                        className="layout" 
                        layouts={DEFAULT_LAYOUTS}
                        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                        rowHeight={50}
                        draggableHandle=".drag-handle"
                        margin={[20, 20]}
                    >
                        
                        <div key="rot" className="flex flex-col overflow-hidden">
                             <PlanetRotationView currentDay={currentDay} timeOfDay={timeOfDay} latitude={latitude} />
                        </div>

                        <div key="lunar" className="bg-[#1f2833]/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden">
                             <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30 drag-handle cursor-move shrink-0">
                                <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Calendar size={14} className="text-purple-400" /> Lunar Resonators
                                </h2>
                            </div>
                            <div className="flex-grow min-h-0 overflow-auto flex flex-col items-center p-4">
                                <PlanetaryOrrery currentDay={currentDay} />
                                <div className="w-full space-y-3 mt-4">
                                     <MoonPhaseDisplay moonName="Luna" phase={moonPhases.luna} period={TERRAX_SYSTEM.moons[0].orbitalPeriodDays} color="#e2e8f0" />
                                     <MoonPhaseDisplay moonName="Echo" phase={moonPhases.echo} period={TERRAX_SYSTEM.moons[1].orbitalPeriodDays} color="#94a3b8" />
                                </div>
                            </div>
                        </div>

                        <div key="env" className="flex flex-col overflow-hidden">
                            <EnvironmentalChart currentDay={currentDay} isLeapYear={isLeapYear} latitude={latitude} onLatitudeChange={setLatitude} />
                        </div>

                        <div key="helio" className="bg-[#1f2833]/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden group">
                            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30 drag-handle cursor-move shrink-0">
                                <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Globe size={14} className="text-cyan-400" /> Helio-System
                                </h2>
                                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'}`} />
                            </div>
                            <div className="flex-grow min-h-0 overflow-auto flex items-center justify-center p-4">
                                <SystemOrbitView simTime={simTime} />
                            </div>
                        </div>

                        <div key="obs" className="bg-[#1f2833]/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden">
                             <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30 drag-handle cursor-move shrink-0">
                                <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Telescope size={14} className="text-indigo-400" /> Long-Range Scan
                                </h2>
                            </div>
                            <div className="flex-grow min-h-0 overflow-auto p-4 scrollbar-thin">
                                <ObservationDeck simTime={simTime} />
                            </div>
                        </div>

                    </ResponsiveGridLayout>
                </div>
            </div>
        ) : (
            <div className="bg-[#1f2833]/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Database className="text-cyan-400" /> System Core Repository
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-cyan-400 font-mono mb-4 text-xs uppercase tracking-widest border-l-2 border-cyan-500 pl-3">Planetary Physicals</h3>
                        <pre className="bg-[#0b0c10] p-6 rounded-xl border border-slate-800 overflow-x-auto text-xs text-slate-400 font-mono leading-relaxed">
                            {JSON.stringify(TERRAX_SYSTEM.planet, null, 2)}
                        </pre>
                    </section>
                    <section>
                        <h3 className="text-indigo-400 font-mono mb-4 text-xs uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Orbital Neighbors</h3>
                        <pre className="bg-[#0b0c10] p-6 rounded-xl border border-slate-800 overflow-x-auto text-xs text-slate-400 font-mono leading-relaxed">
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