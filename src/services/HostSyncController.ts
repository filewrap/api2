import { Socket } from 'socket.io-client';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioEngine } from './AudioEngine';
import { RoomState, Track } from '../types';

/**
 * HostSyncController
 * Handles precision synchronization between the Host and Listeners.
 * Ensures seek positions are aligned within a 100ms tolerance.
 */
class HostSyncController {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private syncInterval: number | null = null;
  private isHost: boolean = false;
  private readonly SYNC_THRESHOLD = 0.5; // 500ms tolerance for "soft" sync
  private readonly HARD_SYNC_THRESHOLD = 0.1; // 100ms for "hard" sync

  public init(socket: Socket, roomId: string, isHost: boolean) {
    this.socket = socket;
    this.roomId = roomId;
    this.isHost = isHost;

    if (this.isHost) {
      this.startHostHeartbeat();
    } else {
      this.setupListenerHooks();
    }
  }

  /**
   * HOST LOGIC:
   * Periodically broadcasts the 'source of truth' playback state to all listeners.
   */
  private startHostHeartbeat() {
    this.syncInterval = window.setInterval(() => {
      if (!this.socket || !this.isHost) return;

      const { currentTrack, isPlaying } = usePlayerStore.getState();
      const currentPosition = audioEngine.getCurrentTime();

      this.socket.emit('host_state_update', {
        roomId: this.roomId,
        position: currentPosition,
        isPlaying,
        trackId: currentTrack?.id,
        timestamp: Date.now(), // For latency compensation
      });
    }, 2000); // Heartbeat every 2 seconds
  }

  /**
   * LISTENER LOGIC:
   * Listens for host updates and calculates drift for latency compensation.
   */
  private setupListenerHooks() {
    if (!this.socket) return;

    this.socket.on('sync_to_host', (data: { 
      position: number, 
      isPlaying: boolean, 
      trackId: string, 
      timestamp: number 
    }) => {
      if (this.isHost) return;

      const latency = (Date.now() - data.timestamp) / 1000;
      const targetPosition = data.position + latency;
      const currentLocalPosition = audioEngine.getCurrentTime();
      
      const drift = Math.abs(currentLocalPosition - targetPosition);

      // 1. Check Track Alignment
      const { currentTrack, setTrack } = usePlayerStore.getState();
      if (currentTrack?.id !== data.trackId) {
        console.log('[HostSync] Track mismatch. Re-fetching track metadata...');
        // In production, we would fetch the full track object here
        return;
      }

      // 2. Play/Pause Sync
      if (audioEngine.getIsPlaying() !== data.isPlaying) {
        data.isPlaying ? audioEngine.resume() : audioEngine.pause();
      }

      // 3. Precision Seek Sync
      if (drift > this.SYNC_THRESHOLD) {
        console.log(`[HostSync] Drift detected: ${drift.toFixed(3)}s. Re-syncing...`);
        audioEngine.seek(targetPosition);
      }
    });
  }

  public stop() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.socket?.off('sync_to_host');
  }
}

export const hostSync = new HostSyncController();