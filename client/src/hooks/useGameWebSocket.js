// hooks/useGameWebSocket.js
import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect, useState } from 'react';

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

const WS_URL = `ws://${window.location.host}/ws`;

export function useGameWebSocket(play) {
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState(initialGameState);
  const [buzzedPlayer, setBuzzedPlayer] = useState(null);

  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    onOpen: () => console.log('✅ WebSocket connected'),
    onMessage: (event) => {
      const { type, payload } = JSON.parse(event.data);

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
          setGame((prev) => ({ ...prev, firstBuzz: payload.firstBuzz }));

          setPlayers(payload.players.map((p) => ({ ...p, isArmed: false })));

          if (payload.player?.buzzer) play(payload.player.buzzer);
          break;
        }

        case 'buzzersLocked':
        case 'buzzersArmed':
          setBuzzedPlayer(null);
          setGame((prev) => ({ ...prev, firstBuzz: null }));
          setPlayers(payload.players);
          break;

        case 'scoreUpdate':
          setPlayers((prevPlayers) =>
            payload.players.map((newP, idx) => {
              const prev = prevPlayers[idx];
              if (prev && newP.score != null && prev.score != null) {
                if (newP.score > prev.score) play('correct');
                else if (newP.score < prev.score) play('incorrect');
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
            setGame((prev) => ({ ...prev, firstBuzz: payload.firstBuzz }));
          }
          break;

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
          setGame((prev) => ({ ...prev, nameSize: payload.nameSize }));
          break;

        case 'scoreSizeUpdated':
          setGame((prev) => ({ ...prev, scoreSize: payload.scoreSize }));
          break;

        case 'scoreReset':
          setPlayers(payload.players);
          break;

        case 'playerBuzzerUpdated':
          return {
            ...state,
            players: action.payload.players,
          };

        default:
          console.warn('⚠️ Unhandled message type:', type);
      }
    },
  });

  const send = useCallback(
    (type, payload) => {
      sendJsonMessage({ type, payload });
    },
    [sendJsonMessage]
  );

  const reconnect = useCallback(() => {
    const ws = getWebSocket();
    if (ws?.readyState !== WebSocket.OPEN) {
      ws?.close();
    }
  }, [getWebSocket]);

  return {
    game,
    players,
    buzzedPlayer,
    send,
    readyState,
    reconnect,
  };
}
