import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Library, 
  Users, 
  Settings, 
  Home, 
  Bell, 
  Cast, 
  User as UserIcon,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
  Maximize2
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { cn } from '../../utils/cn';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { label: 'Explore', icon: Home, path: '/' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Library', icon: Library, path: '/library' },
    { label: 'Rooms', icon: Users, path: '/rooms' },
  ];

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-sans">
      {/* --- Sidebar Navigation --- */}
      <aside 
        className={cn(
          "relative flex flex-col border-r border-white/5 bg-surface-container-low transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center">
            <div className="h-4 w-4 bg-surface rounded-full" />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-display-sm font-extrabold tracking-tighter text-primary">
              Streamify
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]" 
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                )}
              >
                <item.icon size={22} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]")} />
                {!isSidebarCollapsed && (
                  <span className={cn("font-medium", isActive ? "font-bold" : "font-medium")}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all"
          >
            <Settings size={22} />
            {!isSidebarCollapsed && <span className="font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(0,240,255,0.03)_0%,_transparent_50%)]">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md bg-surface/50 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             {/* Dynamic Breadcrumbs or Search would go here */}
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Cast size={20} />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
            </button>
            <div className="h-8 w-8 rounded-full bg-surface-bright border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary transition-all">
              <UserIcon size={18} className="text-on-surface-variant" />
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>

        {/* --- Global Player Bar (Teardrop Design) --- */}
        <footer className="h-24 px-6 border-t border-white/5 bg-surface-container-low/80 backdrop-blur-2xl flex items-center justify-between z-40">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 w-1/3">
            <div className="h-14 w-14 rounded-xl overflow-hidden bg-surface-bright shadow-lg border border-white/5 group relative">
              {currentTrack?.thumbnail ? (
                <img src={currentTrack.thumbnail} alt={currentTrack.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-surface-bright to-surface-container text-on-surface-variant">
                   <Maximize2 size={20} />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-sm truncate max-w-[200px]">
                {currentTrack?.title || "No Track Playing"}
              </h4>
              <p className="text-xs text-on-surface-variant truncate max-w-[180px]">
                {currentTrack?.artist || "Select a song to start"}
              </p>
            </div>
            {currentTrack && (
              <button className="text-on-surface-variant hover:text-primary transition-colors ml-2">
                <Heart size={18} />
              </button>
            )}
          </div>

          {/* Central Controls */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="flex items-center gap-6">
              <button className="text-on-surface-variant hover:text-primary transition-all"><SkipBack size={20} /></button>
              <button 
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-primary text-surface flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-all"><SkipForward size={20} /></button>
            </div>
            
            {/* Progress Slider */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] text-on-surface-variant font-mono">0:00</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono">
                {currentTrack?.duration || "0:00"}
              </span>
            </div>
          </div>

          {/* Volume & Extra Tools */}
          <div className="flex items-center justify-end gap-4 w-1/3">
             <div className="flex items-center gap-3 w-32">
                <Volume2 size={18} className="text-on-surface-variant" />
                <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[80%] bg-on-surface-variant" />
                </div>
             </div>
             <button className="text-on-surface-variant hover:text-on-surface transition-colors">
               <Maximize2 size={18} />
             </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;