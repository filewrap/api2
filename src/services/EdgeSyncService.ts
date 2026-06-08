import { Track } from '../types';

/**
 * EdgeSyncService
 * Handles synchronization between local IndexedDB (Dexie) and global Cloudflare KV.
 * Implements a conflict-resolution strategy based on timestamps.
 */
class EdgeSyncService {
  private API_BASE_URL = 'https://apis.kailashhh.com/api/sync';
  private syncInterval: number | null = null;
  private lastSyncTimestamp: number = 0;

  /**
   * Pushes local changes to the Edge (Cloudflare KV via Proxy)
   */
  public async pushLocalLibrary(userId: string, libraryData: { tracks: Track[], playlists: any[] }) {
    console.log('[EdgeSync] Pushing local library state to Cloudflare KV...');
    try {
      const response = await fetch(`${this.API_BASE_URL}/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          data: libraryData,
          timestamp: Date.now()
        })
      });

      if (!response.ok) throw new Error('Failed to push to edge');
      
      this.lastSyncTimestamp = Date.now();
      return await response.json();
    } catch (error) {
      console.error('[EdgeSync] Push failed:', error);
      return null;
    }
  }

  /**
   * Pulls the latest global state from the Edge
   */
  public async pullGlobalLibrary(userId: string) {
    console.log('[EdgeSync] Pulling global library state from Cloudflare KV...');
    try {
      const response = await fetch(`${this.API_BASE_URL}/pull?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to pull from edge');
      
      const remoteData = await response.json();
      return remoteData;
    } catch (error) {
      console.error('[EdgeSync] Pull failed:', error);
      return null;
    }
  }

  /**
   * Reconciles local and remote state (Conflict Resolution)
   */
  public async reconcile(userId: string, localData: any) {
    const remoteData = await this.pullGlobalLibrary(userId);
    
    if (!remoteData) return localData;

    // Logic: If remote is newer than last local push, merge or overwrite
    if (remoteData.timestamp > this.lastSyncTimestamp) {
      console.log('[EdgeSync] Remote state is newer. Merging datasets...');
      // Simple overwrite for prototype; in production, use a CRDT or deep merge
      return remoteData.data;
    }

    return localData;
  }

  /**
   * Background Sync Loop
   */
  public startBackgroundSync(userId: string, getLocalData: () => any) {
    this.syncInterval = window.setInterval(async () => {
      const localData = getLocalData();
      await this.pushLocalLibrary(userId, localData);
    }, 60000); // Sync every 60 seconds
  }

  public stopSync() {
    if (this.syncInterval) clearInterval(this.syncInterval);
  }
}

export const edgeSync = new EdgeSyncService();
