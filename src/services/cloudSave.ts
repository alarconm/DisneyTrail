// Cloud save service for syncing game state with Replit DB

const API_BASE = import.meta.env.PROD
  ? '/api'  // In production, same origin
  : 'http://localhost:3001/api';  // In dev, separate server

export interface CloudSaveState {
  isStarted: boolean;
  day: number;
  month: number;
  year: number;
  playerName: string;
  profession: string;
  partyMembers: unknown[];
  morale: number;
  resources: unknown;
  currentLandmarkIndex: number;
  distanceTraveled: number;
  distanceToNextLandmark: number;
  pace: string;
  rations: string;
  googlyEyesMode: boolean;
  lastSaved?: string;
}

export interface SaveResponse {
  success: boolean;
  message?: string;
  lastSaved?: string;
  error?: string;
}

export interface LoadResponse {
  success: boolean;
  gameState?: CloudSaveState;
  error?: string;
}

// Save game to cloud
export async function saveToCloud(saveId: string, gameState: CloudSaveState): Promise<SaveResponse> {
  try {
    const response = await fetch(`${API_BASE}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saveId, gameState }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save');
    }

    return data;
  } catch (error) {
    console.error('Cloud save error:', error);
    return { success: false, error: String(error) };
  }
}

// Load game from cloud
export async function loadFromCloud(saveId: string): Promise<LoadResponse> {
  try {
    const response = await fetch(`${API_BASE}/load/${encodeURIComponent(saveId)}`);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'No save found for this name' };
      }
      throw new Error(data.error || 'Failed to load');
    }

    return data;
  } catch (error) {
    console.error('Cloud load error:', error);
    return { success: false, error: String(error) };
  }
}

// Check if save exists
export async function checkSaveExists(saveId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/exists/${encodeURIComponent(saveId)}`);
    const data = await response.json();
    return data.exists || false;
  } catch (error) {
    console.error('Check save error:', error);
    return false;
  }
}

// Delete cloud save
export async function deleteCloudSave(saveId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/save/${encodeURIComponent(saveId)}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Delete save error:', error);
    return false;
  }
}
