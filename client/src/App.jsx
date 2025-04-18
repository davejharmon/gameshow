import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Dashboard from './components/Dashboard';
import PlayerScreen from './components/PlayerScreen';
import { useGameSounds } from './hooks/useGameSounds';

const WS_URL = 'ws://localhost:3001';

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role'); // 'operator', 'player1', or 'player2'
  const { playBuzz, playIncorrect, playCorrect, playWin } = useGameSounds(role);
  const [firstBuzz, setFirstBuzz] = useState(null); // Add firstBuzz state
  const [scores, setScores] = useState({});
  const [buzzedPlayer, setBuzzedPlayer] = useState(null);

  // Store previous scores for comparison
  const [prevScores, setPrevScores] = useState({});

  const reconnect = () => {
    const ws = getWebSocket();
    if (ws?.readyState !== WebSocket.OPEN) {
      ws?.close(); // Triggers a reconnect
    }
  };

  const { sendJsonMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket(WS_URL, {
      onOpen: () => console.log('✅ WebSocket connected'),
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        const { type, payload } = data;

        switch (type) {
          case 'buzzRegistered':
            setBuzzedPlayer(payload.player);
            setFirstBuzz(payload.firstBuzz);
            playBuzz();
            break;
          case 'buzzersArmed':
            setBuzzedPlayer(null);
            break;
          case 'scoreUpdate':
            const newScores = payload;
            setScores(newScores);
            for (let player in newScores) {
              if (newScores[player] > (prevScores[player] || 0)) {
                playCorrect();
              } else if (newScores[player] < (prevScores[player] || 0)) {
                playIncorrect();
              }
            }
            setPrevScores(newScores);
            break;
          default:
            break;
        }
      },
      shouldReconnect: () => true, // Auto-reconnect
    });

  const send = (type, payload) => sendJsonMessage({ type, payload });

  if (role === 'operator') {
    return (
      <Dashboard
        scores={scores}
        send={send}
        firstBuzz={firstBuzz}
        connectionStatus={readyState}
        reconnect={reconnect}
      />
    );
  }

  return (
    <PlayerScreen
      role={role}
      scores={scores}
      buzzedPlayer={buzzedPlayer}
      send={send}
      connectionStatus={readyState}
      reconnect={reconnect}
    />
  );
};

export default App;
