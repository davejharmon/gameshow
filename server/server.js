const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const pleasingColors = [
  'tomato',
  'cornflowerblue',
  'mediumseagreen',
  'orchid',
  'skyblue',
  'sandybrown',
  'mediumslateblue',
];

// === Game State ===
let gameState = {
  firstBuzz: null,
  players: [
    {
      id: 'player1',
      nickname: 'Player 1',
      color: 'tomato',
      score: 0,
      isArmed: false,
    },
  ],
  pointsToAdd: 10,
  pointsToDeduct: 10,
};

// Variable to track the next available player ID
let nextPlayerId = 2; // Start from 1 since 'player0' is already in the state

// === Serve React Frontend ===
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// === WebSocket Logic ===
wss.on('connection', (ws) => {
  sendGameState(ws);

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
      case 'addPlayer':
        handleAddPlayer(payload);
        break;
      case 'deletePlayer':
        handleDeletePlayer(payload);
        break;
      case 'lockBuzzers':
        handleLockBuzzers();
        break;

      case 'armBuzzers':
        handleArmBuzzers(payload);
        break;
      case 'buzz':
        handleBuzz(payload);
        break;
      case 'awardPoint':
        handleAwardPoint(payload);
        break;
      case 'deductPoint':
        handleDeductPoint(payload);
        break;
      case 'resetGame':
        handleResetGame();
        break;
      case 'editNickname':
        handleEditNickname(payload);
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  });
});

// === Game Logic Handlers ===

function sendGameState(ws) {
  ws.send(
    JSON.stringify({
      type: 'scoreUpdate',
      payload: {
        players: gameState.players,
      },
    })
  );
}

function handleAddPlayer() {
  // Ensure the new player gets a unique ID based on nextPlayerId
  const newPlayer = {
    id: `player${nextPlayerId}`, // Use the next available player ID
    nickname: `Player ${nextPlayerId}`, // Use the correct player number for display
    color: pleasingColors[nextPlayerId % pleasingColors.length],
    score: 0,
    isArmed: false,
  };

  gameState.players.push(newPlayer);
  nextPlayerId++; // Increment the player ID counter after adding the player

  broadcast({
    type: 'playerAdded',
    payload: {
      players: gameState.players,
    },
  });
}

function handleDeletePlayer(payload) {
  const { id } = payload;

  const index = gameState.players.findIndex((p) => p.id === id);
  if (index !== -1) {
    gameState.players.splice(index, 1);

    // If the deleted player was the first to buzz, clear the buzz
    if (gameState.firstBuzz === id) {
      gameState.firstBuzz = null;
    }

    broadcast({
      type: 'playerDeleted',
      payload: {
        players: gameState.players,
        firstBuzz: gameState.firstBuzz,
      },
    });
  }
}

function handleLockBuzzers() {
  gameState.players.forEach((player) => {
    player.isArmed = false;
  });

  console.log('All buzzers locked.');

  broadcast({
    type: 'buzzersLocked',
    payload: {
      players: gameState.players,
    },
  });
}

/**
 * Arms buzzers for players based on the provided payload.
 *
 * Payload options:
 * - { only: [index1, index2, ...] } → arms only the specified player indexes
 * - { except: [index1, index2, ...] } → arms all players except the specified indexes
 * - no payload → arms all players
 *
 * @param {Object} payload - Optional payload specifying which buzzers to arm
 */
function handleArmBuzzers(payload = {}) {
  const { only, except } = payload;
  gameState.firstBuzz = null;

  gameState.players.forEach((player) => {
    if (only) {
      player.isArmed = only.includes(player.id);
    } else if (except) {
      player.isArmed = !except.includes(player.id);
    } else {
      player.isArmed = true;
    }
  });

  const armedPlayers = gameState.players
    .filter((p) => p.isArmed)
    .map((p) => ({ id: p.id, nickname: p.nickname }));

  console.log('Buzzers armed for:', armedPlayers);

  broadcast({
    type: 'buzzersArmed',
    payload: {
      players: gameState.players,
    },
  });
}

function handleBuzz(payload) {
  if (gameState.firstBuzz !== null) {
    console.log(
      `Buzz ignored from ${payload.id}: someone already buzzed (${gameState.firstBuzz})`
    );
    return;
  }

  const player = gameState.players.find((p) => p.id === payload.id);
  if (player && player.isArmed) {
    gameState.firstBuzz = player.id;

    // Disarm all players
    gameState.players.forEach((p) => {
      p.isArmed = false;
    });

    console.log(`Buzz accepted from ${player.id} (${player.nickname})`);

    broadcast({
      type: 'buzzRegistered',
      payload: {
        player,
        firstBuzz: gameState.firstBuzz,
        players: gameState.players,
      },
    });
  } else {
    console.log(
      `Buzz ignored from ${payload.id}: player not found or not armed`
    );
  }
}

function handleAwardPoint(payload) {
  const { id, points } = payload;
  const add = points || gameState.pointsToAdd;

  const target = gameState.players.find((p) => p.id === id);
  if (target) {
    target.score += add;
  }

  broadcast({
    type: 'scoreUpdate',
    payload: {
      players: gameState.players,
    },
  });
}

function handleDeductPoint(payload) {
  const { id, points } = payload;
  const deduct = points || gameState.pointsToDeduct;

  const target = gameState.players.find((p) => p.id === id);
  if (target) {
    target.score -= deduct;
  }

  broadcast({
    type: 'scoreUpdate',
    payload: {
      players: gameState.players,
    },
  });
}

function handleResetGame() {
  gameState = {
    firstBuzz: null,
    players: [],
    pointsToAdd: 1,
    pointsToDeduct: 1,
  };

  broadcast({
    type: 'scoreUpdate',
    payload: {
      players: gameState.players,
    },
  });

  broadcast({
    type: 'buzzersArmed',
    payload: {
      players: gameState.players,
    },
  });
}

function handleEditNickname(payload) {
  const { id, newNickname } = payload;

  // Find the player by their ID
  const player = gameState.players.find((p) => p.id === id);
  if (player) {
    // Update the player's nickname
    player.nickname = newNickname;

    // Broadcast the updated game state to all clients
    broadcast({
      type: 'nicknameUpdated',
      payload: {
        players: gameState.players,
      },
    });

    console.log(`Nickname updated for player ${id}: ${newNickname}`);
  } else {
    console.log(`Player with ID ${id} not found`);
  }
}

// === WebSocket Broadcast ===
function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// === Start Server ===
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server and frontend running at http://localhost:${PORT}`);
});
