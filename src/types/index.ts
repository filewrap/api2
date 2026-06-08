export type Source = 'spotify' | 'youtube' | 'soundcloud' | 'audiomack' | 'lastfm' | 'gaana' | 'jiosaavn' | 'local';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnail: string;
  duration: string;
  source: Source;
  streamUrl?: string;
}

export interface User {
  id: string;
  displayName: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface RoomState {
  id: string;
  name: string;
  hostId: string;
  currentTrack: Track | null;
  position: number;
  isPlaying: boolean;
  queue: Track[];
  listeners: User[];
}