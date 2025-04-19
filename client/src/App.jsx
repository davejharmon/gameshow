import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Dashboard from './components/Dashboard';
import PlayerScreen from './components/PlayerScreen';
import { useGameSounds } from './hooks/useGameSounds';
import LandingPage from './components/LandingPage';
import { Route, Routes } from 'react-router';
import ConnectionStatus from './components/ConnectionStatus';

const WS_URL = `ws://${window.location.host}/ws`;

const initialGameState = {
  firstBuzz: null,
  pointsToAdd: 10,
  pointsToDeduct: 10,
};

// const redirectToRole = (role) => {
//   const url = new URL(window.location.href);
//   url.searchParams.set('role', role);
//   window.location.href = url.toString();
// };

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
        case 'buzzRegistered':
          setBuzzedPlayer(payload.player);
          setGame((prev) => ({
            ...prev,
            firstBuzz: payload.firstBuzz,
          }));
          setPlayers(payload.players);
          playBuzz();
          break;

        case 'buzzersArmed':
          setBuzzedPlayer(null);
          setGame((prev) => ({
            ...prev,
            firstBuzz: null,
          }));
          setPlayers(payload.players);
          break;

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
          setPlayers(payload.players);
          break;

        case 'playerDeleted':
          setPlayers(payload.players);
          setGame((prev) => ({
            ...prev,
            firstBuzz: payload.firstBuzz,
          }));
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
          element={<Dashboard game={game} players={players} send={send} />}
        />
        <Route
          path='players/:playerId'
          element={
            <PlayerScreen
              players={players}
              buzzedPlayer={buzzedPlayer}
              send={send}
            />
          }
        />
        <Route path='/*' element={<LandingPage players={players} />} />
      </Routes>
    </>
  );
};

export default App;
