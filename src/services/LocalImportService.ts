import Dexie, { Table } from 'dexie';
import { Track } from '../types';

/**
 * LocalFileIndexer
 * Manages the "Local Import" scanner using IndexedDB (Dexie).
 * Stores binary audio data and metadata for offline high-fidelity playback.
 */
export interface LocalTrack extends Track {
  blob?: Blob;
  addedAt: number;
}

class StreamifyDB extends Dexie {
  tracks!: Table<LocalTrack>;

  constructor() {
    super('StreamifyDB');
    this.version(1).stores({
      tracks: '++id, title, artist, source, addedAt'
    });
  }
}

const db = new StreamifyDB();

export const localImportService = {
  /**
   * Scans and imports local files into IndexedDB
   */
  async importFile(file: File): Promise<LocalTrack> {
    console.log(`[LocalImport] Indexing: ${file.name}`);
    
    // In production, we'd use 'music-metadata-browser' to extract ID3 tags
    const newTrack: LocalTrack = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Artist",
      source: 'local',
      thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200",
      duration: "0:00", // Would be calculated from blob
      blob: file,
      addedAt: Date.now()
    };

    await db.tracks.add(newTrack);
    return newTrack;
  },

  /**
   * Retrieves all locally indexed tracks
   */
  async getLocalLibrary(): Promise<LocalTrack[]> {
    return await db.tracks.toArray();
  },

  /**
   * Generates an object URL for the local blob to be played by UnifiedAudioEngine
   */
  getStreamUrl(track: LocalTrack): string {
    if (track.blob) {
      return URL.createObjectURL(track.blob);
    }
    return '';
  }
};
