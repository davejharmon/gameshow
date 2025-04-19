const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// === Game state ===
let gameState = {
  armed: false,
  firstBuzz: null,
  scores: {
    player1: 0,
    player2: 0,
  },
};

// === Serve React frontend from ../client/build ===
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

// === Fallback route for SPA (React Router) ===
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// === WebSocket logic ===
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'scoreUpdate', payload: gameState.scores }));

  ws.on('message', (message) => {
    let data = {};
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Invalid JSON:', message);
      return;
    }

    const { type, payload } = data;

    console.log(`Received message: ${type}`, payload);

    switch (type) {
      case 'armBuzzers':
        gameState.armed = true;
        gameState.firstBuzz = null;
        broadcast({ type: 'buzzersArmed' });
        break;

      case 'buzz':
        if (gameState.armed && !gameState.firstBuzz) {
          gameState.firstBuzz = payload.player;
          gameState.armed = false;
          broadcast({
            type: 'buzzRegistered',
            payload: { player: payload.player, firstBuzz: gameState.firstBuzz },
          });
        }
        break;

      case 'awardPoint':
        const awardPoints = payload.points || 1; // Default to 1 if no points specified
        gameState.scores[payload.player] += awardPoints;
        broadcast({ type: 'scoreUpdate', payload: gameState.scores });
        break;

      case 'deductPoint':
        const deductPoints = payload.points || 1; // Default to 1 if no points specified
        gameState.scores[payload.player] -= deductPoints;
        console.log(`Updated scores after deduction:`, gameState.scores);
        broadcast({ type: 'scoreUpdate', payload: gameState.scores });
        break;

      default:
        break;
    }
  });

  ws.send(JSON.stringify({ type: 'scoreUpdate', payload: gameState.scores }));
});

// === Broadcast to all WebSocket clients ===
function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// === Start server ===
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server and frontend running at http://localhost:${PORT}`);
});
