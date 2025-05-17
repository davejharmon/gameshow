const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// === Use pkg-compatible path handling ===
const fs = require('fs');

const isPkg = typeof process.pkg !== 'undefined';

// baseDir points to the executable directory for pkg builds, or __dirname in dev
const baseDir = isPkg
  ? path.dirname(fs.realpathSync(process.execPath))
  : __dirname;

// Build path relative to baseDir for pkg compatibility
const buildPath = path.join(baseDir, 'client', 'build');

// === Serve React Frontend ===
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  // Use buildPath and sendFile with error handling for diagnostics
  const indexHtmlPath = path.join(buildPath, 'index.html');
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(err.status).end();
    }
  });
});

const pleasingColors = [
  '#FF6347', // tomato
  '#6495ED', // cornflowerblue
  '#3CB371', // mediumseagreen
  '#DA70D6', // orchid
  '#87CEEB', // skyblue
  '#F4A460', // sandybrown
  '#7B68EE', // mediumslateblue
];

const initialGameState = {
  firstBuzz: null,
  players: [
    {
      id: 'player1',
      nickname: 'Player 1',
      color: pleasingColors[0],
      score: 0,
      isArmed: false,
    },
  ],
  pointsToAdd: 10,
  pointsToDeduct: 10,
  nameSize: 8,
  scoreSize: 32,
  timerDuration: 300,
  isTimerRunning: false,
  isTimerShowing: false,
  resetCount: 0,
};

// === Game State ===
let gameState = JSON.parse(JSON.stringify(initialGameState));

// Variable to track the next available player ID
let nextPlayerId = 2; // Start from 1 since 'player0' is already in the state

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
      case 'setScore':
        handleSetScore(payload);
        break;
      case 'setPlayerColor':
        handleSetPlayerColor(payload);
        break;
      case 'awardPoint':
        handleAwardPoint(payload);
        break;
      case 'deductPoint':
        handleDeductPoint(payload);
        break;
      case 'resetScores':
        handleResetScores();
        break;
      case 'resetGame':
        handleResetGame();
        break;
      case 'editNickname':
        handleEditNickname(payload);
        break;
      case 'setPointsToAdd': // New case for setting points to add
        handleSetPointsToAdd(payload);
        break;
      case 'setPointsToDeduct': // New case for setting points to deduct
        handleSetPointsToDeduct(payload);
        break;
      case 'setNameSize':
        handleSetNameSize(payload);
        break;
      case 'setScoreSize':
        handleSetScoreSize(payload);
        break;
      case 'setTimerDuration':
        handleSetTimerDuration(payload);
        break;
      case 'toggleTimerRunning':
        handleToggleTimerRunning();
        break;
      case 'toggleTimerShowing':
        handleToggleTimerShowing();
        break;
      case 'incrementResetCount':
        handleIncrementResetCount();
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
      type: 'gameState',
      payload: {
        game: {
          firstBuzz: gameState.firstBuzz,
          pointsToAdd: gameState.pointsToAdd,
          pointsToDeduct: gameState.pointsToDeduct,
          nameSize: gameState.nameSize, // Add this line
          scoreSize: gameState.scoreSize, // Add this line
          timerDuration: gameState.timerDuration,
          isTimerRunning: gameState.isTimerRunning,
          isTimerShowing: gameState.isTimerShowing,
          resetCount: gameState.resetCount,
        },
        players: gameState.players,
      },
    })
  );
}

function handleSetTimerDuration(payload) {
  const { duration } = payload;

  if (
    typeof duration !== 'number' ||
    duration <= 0 ||
    !Number.isInteger(duration)
  ) {
    console.error('Invalid timer duration:', duration);
    return;
  }

  gameState.timerDuration = duration;

  broadcast({
    type: 'timerDurationUpdated',
    payload: { timerDuration: gameState.timerDuration },
  });

  console.log(`Timer duration set to ${gameState.timerDuration} seconds.`);
}

function handleToggleTimerRunning() {
  gameState.isTimerRunning = !gameState.isTimerRunning;

  broadcast({
    type: 'timerRunningToggled',
    payload: { isTimerRunning: gameState.isTimerRunning },
  });

  console.log(`Timer running: ${gameState.isTimerRunning}`);
}

function handleToggleTimerShowing() {
  gameState.isTimerShowing = !gameState.isTimerShowing;

  broadcast({
    type: 'timerShowingToggled',
    payload: { isTimerShowing: gameState.isTimerShowing },
  });

  console.log(`Timer showing: ${gameState.isTimerShowing}`);
}

function handleIncrementResetCount() {
  gameState.resetCount += 1;

  broadcast({
    type: 'resetCountIncremented',
    payload: { resetCount: gameState.resetCount },
  });

  console.log(`Reset count incremented: ${gameState.resetCount}`);
}

function handleSetPlayerColor(payload) {
  const { id, color } = payload;

  if (typeof id !== 'string' || typeof color !== 'string') {
    console.error('Invalid player ID or color:', payload);
    return;
  }

  const player = gameState.players.find((p) => p.id === id);

  if (!player) {
    console.warn(`Player with ID "${id}" not found.`);
    return;
  }

  player.color = color;

  broadcast({
    type: 'playerColorUpdated',
    payload: {
      id,
      color,
      players: gameState.players,
    },
  });

  console.log(`Player ${id}'s color updated to ${color}`);
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

function handleSetScore(payload) {
  if (!payload || typeof payload !== 'object') {
    console.error('Invalid payload:', payload);
    return;
  }

  const { id, score } = payload;

  // Validate the id and points
  if (
    typeof id !== 'string' ||
    typeof score !== 'number' ||
    !Number.isFinite(score)
  ) {
    console.error('Invalid id or points:', { id, score });
    return;
  }

  const target = gameState.players.find((p) => p.id === id);

  if (!target) {
    console.warn(`Player with ID "${id}" not found.`);
    return;
  }

  target.score = score;

  broadcast({
    type: 'scoreUpdate',
    payload: {
      players: gameState.players,
    },
  });
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

function handleResetScores() {
  gameState.players.forEach((player) => {
    player.score = 0;
  });

  broadcast({
    type: 'scoreReset',
    payload: {
      players: gameState.players,
    },
  });

  console.log('All player scores have been reset.');
}

function handleResetGame() {
  gameState = JSON.parse(JSON.stringify(initialGameState));
  nextPlayerId = 2; // Reset player ID tracker

  broadcast({
    type: 'gameState',
    payload: {
      game: {
        firstBuzz: gameState.firstBuzz,
        pointsToAdd: gameState.pointsToAdd,
        pointsToDeduct: gameState.pointsToDeduct,
        nameSize: gameState.nameSize,
        scoreSize: gameState.scoreSize,
        timerDuration: gameState.timerDuration,
        isTimerRunning: gameState.isTimerRunning,
        isTimerShowing: gameState.isTimerShowing,
        resetCount: gameState.resetCount,
      },
      players: gameState.players,
    },
  });

  console.log('Game has been reset to initial state.');
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

function handleSetPointsToAdd(payload) {
  const { points } = payload;

  // Ensure the points is a valid number
  if (typeof points !== 'number' || !Number.isFinite(points)) {
    console.error('Invalid points value:', points);
    return;
  }

  // Update the game state
  gameState.pointsToAdd = points;

  // Broadcast the updated points to all clients
  broadcast({
    type: 'pointsToAddUpdated',
    payload: {
      pointsToAdd: gameState.pointsToAdd,
    },
  });

  console.log(`Points to add updated: ${points}`);
}

function handleSetPointsToDeduct(payload) {
  const { points } = payload;

  // Ensure the points is a valid number
  if (typeof points !== 'number' || !Number.isFinite(points)) {
    console.error('Invalid points value:', points);
    return;
  }

  // Update the game state
  gameState.pointsToDeduct = points;

  // Broadcast the updated points to all clients
  broadcast({
    type: 'pointsToDeductUpdated',
    payload: {
      pointsToDeduct: gameState.pointsToDeduct,
    },
  });

  console.log(`Points to deduct updated: ${points}`);
}

function handleSetNameSize(payload) {
  const { size } = payload;
  if (typeof size === 'number' && Number.isInteger(size)) {
    gameState.nameSize = size;
    broadcast({
      type: 'nameSizeUpdated',
      payload: { nameSize: gameState.nameSize },
    });
    console.log(`Name size updated: ${gameState.nameSize}`);
  } else {
    console.log('Invalid input. Please provide an integer value for size.');
  }
}

function handleSetScoreSize(payload) {
  const { size } = payload;
  if (typeof size === 'number' && Number.isInteger(size)) {
    gameState.scoreSize = size;
    broadcast({
      type: 'scoreSizeUpdated',
      payload: { scoreSize: gameState.scoreSize },
    });
    console.log(`Score size updated: ${gameState.scoreSize}`);
  } else {
    console.log('Invalid input. Please provide an integer value for size.');
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
