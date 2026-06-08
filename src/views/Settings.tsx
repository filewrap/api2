import React, { useState } from 'react';
import { 
  Palette, 
  Volume2, 
  Shield, 
  Smartphone, 
  Zap, 
  Monitor, 
  Moon, 
  Sun,
  Layout,
  Layers,
  Database,
  Cloud
} from 'lucide-react';
import { cn } from '../utils/cn';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Appearance');

  const tabs = [
    { id: 'Appearance', icon: Palette },
    { id: 'Audio', icon: Volume2 },
    { id: 'Sync', icon: Cloud },
    { id: 'Advanced', icon: Zap },
  ];

  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-5xl font-black tracking-tighter">Settings</h1>
        <p className="text-on-surface-variant mt-2">Customize your high-fidelity streaming environment.</p>
      </header>

      <div className="flex gap-12">
        {/* Navigation Sidebar */}
        <aside className="w-64 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold",
                activeTab === tab.id 
                  ? "bg-primary text-surface shadow-2xl shadow-primary/20 scale-105" 
                  : "text-on-surface-variant hover:bg-white/5"
              )}
            >
              <tab.icon size={20} />
              {tab.id}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-10">
          {activeTab === 'Appearance' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <section className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Monitor size={18} className="text-primary" /> Visualizer Engine
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="p-6 rounded-3xl bg-surface-container-low/40 border border-white/5 flex items-center justify-between">
                        <div>
                           <p className="font-bold">Real-time GPU Shaders</p>
                           <p className="text-xs text-on-surface-variant">Enables 60fps WebGL background visualizers.</p>
                        </div>
                        <div className="h-6 w-12 rounded-full bg-primary p-1 flex justify-end cursor-pointer">
                           <div className="h-4 w-4 rounded-full bg-surface" />
                        </div>
                     </div>
                     <div className="p-6 rounded-3xl bg-surface-container-low/40 border border-white/5 space-y-4">
                        <p className="font-bold text-sm">Resonance Intensity</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full relative">
                           <div className="absolute top-0 left-0 h-full w-3/4 bg-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                           <div className="absolute top-1/2 left-3/4 -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-lg" />
                        </div>
                     </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Layers size={18} className="text-primary" /> Glassmorphism Depth
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     {['Standard', 'Frosted', 'Opaque', 'Ghost'].map(style => (
                       <button key={style} className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/50 transition-all text-sm font-bold">
                         {style}
                       </button>
                     ))}
                  </div>
                </section>
             </div>
          )}

          {activeTab === 'Sync' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="p-8 rounded-[40px] bg-primary/10 border border-primary/20 flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Cloud size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-primary">Edge Persistence Active</h3>
                    <p className="text-sm text-primary/70">Your library is being synced to music.kailashhh.com via Cloudflare KV.</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Database size={18} className="text-primary" /> Local Storage (IndexedDB)
                  </h3>
                  <div className="p-6 rounded-3xl bg-surface-container-low/40 border border-white/5 flex items-center justify-between">
                     <div>
                        <p className="font-bold">Offline Cache Size</p>
                        <p className="text-xs text-on-surface-variant">428 MB of 5 GB used.</p>
                     </div>
                     <button className="text-xs font-bold text-red-400 hover:underline">Clear Cache</button>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
