import React from 'react';
import { Route, Routes } from 'react-router';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ConnectionStatus from './components/ConnectionStatus';
import Screen from './components/Screen';
import ScreenLoader from './components/ScreenLoader';
import { useGameSounds } from './hooks/useGameSounds';
import { useGameWebSocket } from './hooks/useGameWebSocket';

const App = () => {
  const { play } = useGameSounds();
  const { game, players, buzzedPlayer, send, readyState, reconnect } =
    useGameWebSocket(play);

  return (
    <>
      <ConnectionStatus status={readyState} onReconnect={reconnect} />
      <Routes>
        <Route
          path='dashboard'
          element={
            <Dashboard
              game={game}
              setGame={() => {}}
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
