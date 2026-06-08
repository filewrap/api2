import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Cpu, 
  Wind, 
  Zap, 
  Activity,
  Play,
  Plus,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { cn } from '../utils/cn';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * NeuralSearchService
 * Simulated AI service that maps natural language 'Vibes' to track metadata.
 */
interface NeuralResult {
  trackId: string;
  title: string;
  artist: string;
  thumbnail: string;
  matchScore: number;
  tags: string[];
}

const AI_NEURAL_SEARCH: React.FC = () => {
  const [vibeQuery, setVibeQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<NeuralResult[]>([]);
  const { setTrack } = usePlayerStore();

  const handleNeuralAnalysis = async () => {
    if (!vibeQuery.trim()) return;
    
    setIsProcessing(true);
    // Simulate Neural Network latency
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    setResults([
      {
        trackId: '1',
        title: 'Neon Drift',
        artist: 'Glitch Mob',
        thumbnail: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400',
        matchScore: 98,
        tags: ['Cybernetic', 'High Energy']
      },
      {
        trackId: '2',
        title: 'Silicon Soul',
        artist: 'Data Mirage',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400',
        matchScore: 92,
        tags: ['Melancholic', 'Fluid']
      },
      {
        trackId: '3',
        title: 'Zero Day',
        artist: 'Kernel Panic',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400',
        matchScore: 87,
        tags: ['Atmospheric', 'Focus']
      }
    ]);
    setIsProcessing(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* --- Neural Input Stage --- */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">
          <Sparkles size={14} /> AI Neural Discovery
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter max-w-3xl mx-auto leading-tight">
          Describe your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-gradient-x">vibe</span>. Let the AI do the rest.
        </h1>

        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-transparent blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative">
             <input 
               type="text"
               value={vibeQuery}
               onChange={(e) => setVibeQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleNeuralAnalysis()}
               placeholder="e.g. Rainy night in Neo-Tokyo with heavy synthesizers..."
               className="w-full bg-surface-container-low/40 backdrop-blur-2xl border border-white/10 rounded-[32px] py-6 pl-8 pr-20 text-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
             />
             <button 
               onClick={handleNeuralAnalysis}
               disabled={isProcessing || !vibeQuery.trim()}
               className="absolute right-3 top-3 h-14 w-14 rounded-2xl bg-primary text-surface flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
             >
               {isProcessing ? <Activity size={24} className="animate-spin" /> : <ChevronRight size={28} />}
             </button>
          </div>
        </div>

        {/* Neural Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
             <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
             <p className="text-xs font-mono text-primary uppercase tracking-widest">Synthesizing Audio Signatures...</p>
          </div>
        )}
      </section>

      {/* --- Semantic Results Grid --- */}
      {results.length > 0 && !isProcessing && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
           {results.map((result, idx) => (
             <div 
               key={idx} 
               className="group relative bg-surface-container-low/30 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 hover:bg-surface-container-high/40 transition-all duration-500 overflow-hidden shadow-2xl"
             >
                {/* Match Score Gauge */}
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                   <span className="text-[10px] font-bold text-on-surface">{result.matchScore}% Match</span>
                </div>

                <div className="relative aspect-square rounded-[28px] overflow-hidden mb-6 shadow-2xl">
                   <img src={result.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-primary text-surface flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Play size={32} fill="currentColor" />
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{result.title}</h3>
                    <p className="text-on-surface-variant font-medium">{result.artist}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-on-surface-variant border border-white/5 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                     <button className="text-xs font-bold text-primary flex items-center gap-2">
                        <Fingerprint size={16} /> Analysis
                     </button>
                     <button className="p-2 text-on-surface-variant hover:text-on-surface">
                        <Plus size={20} />
                     </button>
                  </div>
                </div>
             </div>
           ))}
        </section>
      )}

      {/* --- Mood Clusters --- */}
      {!isProcessing && results.length === 0 && (
        <section className="pt-12 text-center">
          <p className="text-sm text-on-surface-variant font-bold uppercase tracking-[0.3em] mb-10">Popular Mood Clusters</p>
          <div className="flex flex-wrap justify-center gap-4">
             {['Neon Noir', 'Zen Focus', 'Acid Technocore', 'Organic Lo-Fi', 'Glitch Hop'].map((cluster) => (
               <button 
                 key={cluster}
                 onClick={() => setVibeQuery(cluster)}
                 className="px-8 py-4 rounded-2xl bg-surface-container-low/40 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold flex items-center gap-3 group"
               >
                 <Zap size={16} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                 {cluster}
               </button>
             ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AI_NEURAL_SEARCH;