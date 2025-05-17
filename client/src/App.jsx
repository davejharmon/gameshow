import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Dashboard from './components/Dashboard';
import { useGameSounds } from './hooks/useGameSounds';
import LandingPage from './components/LandingPage';
import { Route, Routes } from 'react-router';
import ConnectionStatus from './components/ConnectionStatus';
import Screen from './components/Screen';
import ScreenLoader from './components/ScreenLoader';
const WS_URL = `ws://${window.location.host}/ws`;

const initialGameState = {
  firstBuzz: null,
  pointsToAdd: 10,
  pointsToDeduct: 10,
  nameSize: 24,
  scoreSize: 36,
  timerDuration: 300,
  isTimerRunning: false,
  isTimerShowing: false,
  resetCount: 0,
};

const App = () => {
  const { playBuzz, playIncorrect, playCorrect } = useGameSounds();
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState(initialGameState);
  const [buzzedPlayer, setBuzzedPlayer] = useState(null);

  const reconnect = () => {
    const ws = getWebSocket();
    if (ws?.readyState !== WebSocket.OPEN) {
      ws?.close();
    }
  };

  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(WS_URL, {
    onOpen: () => console.log('✅ WebSocket connected'),
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;

      switch (type) {
        case 'gameState':
          setGame(payload.game);
          setPlayers(payload.players);
          break;

        case 'timerDurationUpdated':
          setGame((prev) => ({
            ...prev,
            timerDuration: payload.timerDuration,
          }));
          break;

        case 'timerRunningToggled':
          setGame((prev) => ({
            ...prev,
            isTimerRunning: payload.isTimerRunning,
          }));
          break;

        case 'timerShowingToggled':
          setGame((prev) => ({
            ...prev,
            isTimerShowing: payload.isTimerShowing,
          }));
          break;

        case 'buzzRegistered': {
          setBuzzedPlayer(payload.player);
          setGame((prev) => ({
            ...prev,
            firstBuzz: payload.firstBuzz,
          }));

          // Lock all buzzers: set isArmed to false for every player
          setPlayers(
            payload.players.map((p) => ({
              ...p,
              isArmed: false,
            }))
          );

          playBuzz();
          break;
        }

        case 'buzzersLocked':
        case 'buzzersArmed': {
          setBuzzedPlayer(null);
          setGame((prev) => ({
            ...prev,
            firstBuzz: null,
          }));
          setPlayers(payload.players);
          break;
        }

        case 'scoreUpdate':
          setPlayers((prevPlayers) =>
            payload.players.map((newP, idx) => {
              const prev = prevPlayers[idx];
              if (prev && newP.score != null && prev.score != null) {
                if (newP.score > prev.score) playCorrect();
                else if (newP.score < prev.score) playIncorrect();
              }
              return newP;
            })
          );
          break;

        case 'playerAdded':
        case 'playerDeleted':
        case 'playerColorUpdated':
        case 'nicknameUpdated':
          setPlayers(payload.players);
          if (type === 'playerDeleted') {
            setGame((prev) => ({
              ...prev,
              firstBuzz: payload.firstBuzz,
            }));
          }
          break;

        // Generic handler for points updates
        case 'setPointsToAdd':
        case 'pointsToAddUpdated':
          setGame((prev) => ({
            ...prev,
            pointsToAdd: payload.pointsToAdd || payload.points,
          }));
          break;

        case 'setPointsToDeduct':
        case 'pointsToDeductUpdated':
          setGame((prev) => ({
            ...prev,
            pointsToDeduct: payload.pointsToDeduct || payload.points,
          }));
          break;
        case 'nameSizeUpdated':
          setGame((prev) => ({
            ...prev,
            nameSize: payload.nameSize,
          }));
          break;

        case 'scoreSizeUpdated':
          setGame((prev) => ({
            ...prev,
            scoreSize: payload.scoreSize,
          }));
          break;
        case 'scoreReset':
          setPlayers(payload.players);
          break;

        default:
          console.warn('⚠️ Unhandled message type:', type);
      }
    },
    shouldReconnect: () => true,
  });

  const send = (type, payload) => sendJsonMessage({ type, payload });
  return (
    <>
      <ConnectionStatus status={readyState} onReconnect={reconnect} />
      <Routes>
        <Route
          path='dashboard'
          element={
            <Dashboard
              game={game}
              setGame={setGame}
              players={players}
              send={send}
            />
          }
        />
        <Route
          path='players/:playerId'
          element={
            <ScreenLoader
              players={players}
              buzzedPlayer={buzzedPlayer}
              send={send}
              nameSize={game.nameSize}
              scoreSize={game.scoreSize}
            />
          }
        />
        <Route path='/*' element={<LandingPage players={players} />} />
        <Route
          path='/screen'
          element={
            <Screen
              players={players}
              buzzedPlayer={buzzedPlayer}
              send={send}
              timer={{
                timerDuration: game.timerDuration,
                isTimerRunning: game.isTimerRunning,
                isTimerShowing: game.isTimerShowing,
                resetCount: game.resetCount,
              }}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
