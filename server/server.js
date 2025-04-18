const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
  armed: false,
  firstBuzz: null,
  scores: {
    player1: 0,
    player2: 0,
  },
};

wss.on('connection', (ws) => {
  // Send the current game state (including scores) when a new client connects
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

    console.log(`Received message: ${type}`, payload); // Debugging log

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
        gameState.scores[payload.player] += 1;
        broadcast({ type: 'scoreUpdate', payload: gameState.scores });
        break;

      case 'deductPoint':
        if (gameState.scores[payload.player] > 0) {
          gameState.scores[payload.player] -= 1; // Deduct 1 point
        }
        console.log(`Updated scores after deduction:`, gameState.scores);
        broadcast({ type: 'scoreUpdate', payload: gameState.scores });
        break;

      default:
        break;
    }
  });

  // Initial score state again (redundant, you can delete one of these if you like)
  ws.send(JSON.stringify({ type: 'scoreUpdate', payload: gameState.scores }));
});

function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

server.listen(3001, () => console.log('WebSocket server running on port 3001'));
