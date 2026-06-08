import React from 'react';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Play, 
  Plus, 
  Heart,
  ChevronRight,
  Disc
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { cn } from '../utils/cn';

const Home: React.FC = () => {
  const { setTrack } = usePlayerStore();

  const featured = {
    title: "Neon City Residency",
    artist: "Synthwave Collective",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1200",
    tags: ["CYBERPUNK", "60 FPS VISUALS"]
  };

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-700">
      {/* --- Hero Feature --- */}
      <section className="relative h-[450px] w-full rounded-[48px] overflow-hidden group shadow-2xl">
        <img 
          src={featured.image} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          alt="Featured"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-12 space-y-6 w-full max-w-3xl">
          <div className="flex gap-3">
             {featured.tags.map(tag => (
               <span key={tag} className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md text-[10px] font-black text-primary tracking-widest uppercase">
                 {tag}
               </span>
             ))}
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none">{featured.title}</h1>
          <p className="text-xl text-on-surface-variant font-medium">Curated high-fidelity landscapes for deep focus.</p>
          
          <div className="flex items-center gap-4 pt-4">
            <button className="px-8 py-4 rounded-2xl bg-primary text-surface font-black flex items-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all">
              <Play size={20} fill="currentColor" /> LISTEN NOW
            </button>
            <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all">
              <Plus size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* --- Grids --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recently Played */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock size={24} className="text-primary" /> Jump Back In
            </h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-surface-container-low/40 border border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-surface-bright overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-primary/10 to-surface-bright" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Neural Drift Vol. {i}</h4>
                  <p className="text-sm text-on-surface-variant">Data Mirage</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Rooms */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp size={24} className="text-primary" /> Active Rooms
            </h2>
            <button className="text-sm font-bold text-on-surface-variant hover:text-primary">View All</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {[1, 2].map(i => (
               <div key={i} className="relative group overflow-hidden rounded-[32px] aspect-[21/9] border border-white/5 shadow-xl">
                 <div className="absolute inset-0 bg-surface-bright" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-8 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2">LIVE SESSION</span>
                    <h3 className="text-2xl font-black">Resonance Chamber {i}</h3>
                    <p className="text-sm text-on-surface-variant mb-4">124 Listeners • @Host{i}</p>
                    <button className="w-fit px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold hover:bg-primary hover:text-surface transition-all">
                      JOIN ROOM
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
