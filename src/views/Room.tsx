import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Music, 
  Share2, 
  Settings,
  AlertCircle,
  ChevronUp,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { usePlayerStore } from '../store/usePlayerStore';
import { RoomState, ChatMessage, User, Track } from '../types';
import { cn } from '../utils/cn';

const SOCKET_URL = 'https://socket.apis.kailashhh.com';

const ListeningRoom: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  
  // Local State
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
  
  // Global Player Store (for local UI updates)
  const { setTrack, togglePlay, isPlaying } = usePlayerStore();

  useEffect(() => {
    // Initialize Socket.io Connection
    socketRef.current = io(SOCKET_URL, {
      query: { roomId },
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Connected to Listening Room:', roomId);
    });

    socket.on('room_state_update', (newState: RoomState) => {
      setRoomState(newState);
      // Synchronize local player if needed
      if (newState.currentTrack) {
        setTrack(newState.currentTrack);
      }
    });

    socket.on('new_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('connect_error', () => {
      setConnectionStatus('error');
    });

    socket.on('reconnecting', () => {
      setConnectionStatus('reconnecting');
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, setTrack]);

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !socketRef.current) return;

    const messageData = {
      roomId,
      text: inputText,
      timestamp: Date.now(),
    };

    socketRef.current.emit('send_message', messageData);
    setInputText('');
  };

  const handleSuggestTrack = (track: Track) => {
    socketRef.current?.emit('suggest_track', { roomId, track });
  };

  if (!roomState && connectionStatus === 'connecting') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
        <div className="h-16 w-16 rounded-full border-t-2 border-primary animate-spin" />
        <p className="text-on-surface-variant font-medium">Entering Resonance Chamber...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-surface relative">
      {/* --- Connection Status Toast --- */}
      {connectionStatus !== 'connected' && (
        <div className={cn(
          "absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border shadow-2xl transition-all duration-500",
          connectionStatus === 'reconnecting' ? "bg-amber-500/20 border-amber-500/30 text-amber-200" : "bg-red-500/20 border-red-500/30 text-red-200"
        )}>
          <AlertCircle size={18} className="animate-pulse" />
          <span className="text-sm font-bold tracking-tight">
            {connectionStatus === 'reconnecting' ? 'Connection unstable. Reconnecting...' : 'Synchronisation offline.'}
          </span>
        </div>
      )}

      {/* --- Main Stage (Player & Visuals) --- */}
      <section className="flex-1 flex flex-col p-8 overflow-y-auto scrollbar-hide">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Music size={20} className="text-primary" />
            </button>
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight flex items-center gap-3">
                {roomState?.name || "Neon Skyline Residency"}
                <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-[10px] text-red-400 uppercase tracking-widest font-bold">Live</span>
              </h1>
              <p className="text-on-surface-variant text-sm flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Users size={14} /> {roomState?.listeners.length || 0} Listening</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Host: @SynthaRex</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-surface-bright border border-white/10 hover:border-primary/50 transition-all text-sm font-bold flex items-center gap-2">
              <Share2 size={16} /> Share Room
            </button>
            <button className="p-2 rounded-xl bg-surface-bright border border-white/10 hover:bg-white/15 transition-colors">
              <Settings size={20} className="text-on-surface-variant" />
            </button>
          </div>
        </header>

        {/* Hero Now Playing */}
        <div className="relative group max-w-4xl mx-auto w-full aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl border border-white/5 bg-surface-container-low/40 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          
          {/* Animated Background Mesh (Visualizer Placeholder) */}
          <div className="absolute inset-0 opacity-40">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,240,255,0.1),_transparent_70%)] animate-pulse" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-12 z-20 gap-12">
            <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-700">
               <img 
                 src={roomState?.currentTrack?.thumbnail || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"} 
                 className="w-full h-full object-cover" 
                 alt="Current track" 
               />
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-2 line-clamp-1">
                  {roomState?.currentTrack?.title || "Cybernetic Dawn"}
                </h2>
                <p className="text-2xl text-on-surface-variant font-medium">
                  {roomState?.currentTrack?.artist || "Data Mirage feat. Null Pointer"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
                 </div>
                 <span className="text-xs font-mono text-on-surface-variant">02:14 / 05:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Up Next List */}
        <div className="mt-12 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Music size={20} className="text-primary" /> Up Next
              </h3>
              <button className="text-sm font-bold text-primary hover:underline transition-all">Suggest Track</button>
           </div>

           <div className="grid grid-cols-1 gap-3">
              {(roomState?.queue || [1, 2, 3]).map((track, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-surface-container-low/50 border border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
                  <span className="text-sm font-mono text-on-surface-variant w-4">{idx + 1}</span>
                  <div className="w-12 h-12 rounded-xl bg-surface-bright overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-surface-bright" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Holographic Heart</h4>
                    <p className="text-xs text-on-surface-variant">Digital Phantoms</p>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><Plus size={18} /></button>
                    <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"><MoreHorizontal size={18} /></button>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <ChevronUp size={16} className="text-primary" />
                    <span className="text-[10px] font-bold text-on-surface-variant">12</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- Sidebar (Chat & Listeners) --- */}
      <aside className="w-[400px] border-l border-white/5 bg-surface-container-low/30 backdrop-blur-xl flex flex-col">
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
           <h3 className="font-bold flex items-center gap-2">
             <MessageSquare size={18} className="text-primary" /> Room Chat
           </h3>
           <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
             <Users size={18} className="text-on-surface-variant" />
           </button>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
           {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="p-4 rounded-full bg-white/5"><MessageSquare size={32} /></div>
                <p className="text-sm">No messages yet.<br/>Be the first to break the silence.</p>
             </div>
           ) : (
             messages.map((msg, idx) => (
               <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {msg.userId.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold">{msg.userId}</span>
                    <span className="text-[10px] text-on-surface-variant">12:45</span>
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-surface-bright/50 border border-white/5 text-sm leading-relaxed">
                    {msg.text}
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-white/5">
           <form onSubmit={sendMessage} className="relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Send a message..."
                className="w-full bg-surface-bright/50 border border-white/10 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-surface rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                disabled={!inputText.trim()}
              >
                <Send size={18} />
              </button>
           </form>
        </div>
      </aside>
    </div>
  );
};

export default ListeningRoom;
