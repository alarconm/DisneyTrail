const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('@replit/database');

const app = express();
const db = new Database();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the dist folder (built frontend)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Save game state
app.post('/api/save', async (req, res) => {
  try {
    const { saveId, gameState } = req.body;

    if (!saveId || !gameState) {
      return res.status(400).json({ error: 'Missing saveId or gameState' });
    }

    // Normalize saveId (lowercase, trim)
    const key = `save_${saveId.toLowerCase().trim()}`;

    // Add timestamp
    const saveData = {
      ...gameState,
      lastSaved: new Date().toISOString(),
    };

    await db.set(key, saveData);

    res.json({ success: true, message: 'Game saved!', lastSaved: saveData.lastSaved });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Load game state
app.get('/api/load/:saveId', async (req, res) => {
  try {
    const { saveId } = req.params;
    const key = `save_${saveId.toLowerCase().trim()}`;

    const saveData = await db.get(key);

    if (!saveData) {
      return res.status(404).json({ error: 'Save not found' });
    }

    res.json({ success: true, gameState: saveData });
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ error: 'Failed to load game' });
  }
});

// Check if save exists
app.get('/api/exists/:saveId', async (req, res) => {
  try {
    const { saveId } = req.params;
    const key = `save_${saveId.toLowerCase().trim()}`;

    const saveData = await db.get(key);

    res.json({ exists: !!saveData });
  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({ error: 'Failed to check save' });
  }
});

// Delete save
app.delete('/api/save/:saveId', async (req, res) => {
  try {
    const { saveId } = req.params;
    const key = `save_${saveId.toLowerCase().trim()}`;

    await db.delete(key);

    res.json({ success: true, message: 'Save deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete save' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
