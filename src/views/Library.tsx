import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  ArrowDownCircle, 
  Filter,
  Play,
  MoreVertical,
  Music,
  FolderOpen
} from 'lucide-react';
import { localImportService, LocalTrack } from '../services/LocalImportService';
import { usePlayerStore } from '../store/usePlayerStore';
import { cn } from '../utils/cn';

const Library: React.FC = () => {
  const [tracks, setTracks] = useState<LocalTrack[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const { setTrack } = usePlayerStore();

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const localTracks = await localImportService.getLocalLibrary();
    setTracks(localTracks);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await localImportService.importFile(file);
      loadLibrary();
    }
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      <header className="flex items-end justify-between">
        <div className="flex items-center gap-6">
           <div className="h-32 w-32 rounded-[40px] bg-gradient-to-br from-primary to-primary-container shadow-2xl flex items-center justify-center text-surface animate-pulse">
              <ArrowDownCircle size={48} />
           </div>
           <div>
              <p className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-2">MY ECOSYSTEM</p>
              <h1 className="text-6xl font-black tracking-tighter">Your Library</h1>
              <p className="text-on-surface-variant mt-2 font-medium">{tracks.length} tracks indexed locally</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <label className="px-6 py-3 rounded-2xl bg-primary text-surface font-black text-sm flex items-center gap-3 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <Plus size={20} /> IMPORT FILES
              <input type="file" className="hidden" onChange={handleFileUpload} accept="audio/*" />
           </label>
        </div>
      </header>

      {/* --- Filters & Controls --- */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
         <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-primary">
               <Filter size={16} /> All Tracks
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface">
               Playlists
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface">
               Artists
            </button>
         </div>
         
         <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setIsGridView(true)}
              className={cn("p-2 rounded-lg transition-all", isGridView ? "bg-white/10 text-primary" : "text-on-surface-variant")}
            >
               <Grid size={18} />
            </button>
            <button 
              onClick={() => setIsGridView(false)}
              className={cn("p-2 rounded-lg transition-all", !isGridView ? "bg-white/10 text-primary" : "text-on-surface-variant")}
            >
               <List size={18} />
            </button>
         </div>
      </div>

      {/* --- Track Space --- */}
      {tracks.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 opacity-40">
           <div className="p-8 rounded-full bg-white/5">
             <FolderOpen size={64} />
           </div>
           <div className="max-w-xs">
              <h3 className="text-xl font-bold mb-2">Silence is over.</h3>
              <p className="text-sm">Drag and drop high-fidelity files or import your existing local library to start building your ecosystem.</p>
           </div>
        </div>
      ) : (
        <div className={cn(
          isGridView ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8" : "space-y-2"
        )}>
           {tracks.map((track) => (
             isGridView ? (
               <div 
                 key={track.id} 
                 className="group relative space-y-4"
                 onDoubleClick={() => setTrack(track)}
               >
                  <div className="aspect-square rounded-[32px] overflow-hidden bg-surface-bright relative shadow-2xl border border-white/5">
                     <img src={track.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={track.title} />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setTrack(track)}
                          className="w-16 h-16 rounded-full bg-primary text-surface flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform"
                        >
                           <Play size={32} fill="currentColor" />
                        </button>
                     </div>
                  </div>
                  <div>
                    <h4 className="font-bold truncate">{track.title}</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">{track.artist}</p>
                  </div>
               </div>
             ) : (
               <div key={track.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-surface-bright overflow-hidden">
                    <img src={track.thumbnail} className="w-full h-full object-cover" alt={track.title} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{track.title}</h4>
                    <p className="text-xs text-on-surface-variant uppercase">{track.artist}</p>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant mr-4">{track.duration}</span>
                  <button className="p-2 text-on-surface-variant hover:text-on-surface"><MoreVertical size={18} /></button>
               </div>
             )
           ))}
        </div>
      )}
    </div>
  );
};

export default Library;
