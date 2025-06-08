import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import styles from './css/Dashboard.module.css';
import PlayerRow from './PlayerRow';
import { useGameSounds } from '../hooks/useGameSounds'; // Make sure the path is correct
import Timer from './Timer';
import SoundboardButton from './SoundboardButton';

const Dashboard = ({ game, setGame, players, send }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [buzzerOptions, setBuzzerOptions] = useState([]);
  const [soundboardOptions, setSoundboardOptions] = useState([]);

  useEffect(() => {
    fetch('/sounds/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        // Set buzzerOptions as keys of data (like categories)
        setBuzzerOptions(Object.keys(data));

        // Set soundboardOptions from the soundboard key if it exists
        if (data.soundboard && Array.isArray(data.soundboard)) {
          setSoundboardOptions(data.soundboard);
        } else {
          setSoundboardOptions([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load sound manifest:', err);
        setBuzzerOptions([]);
        setSoundboardOptions([]);
      });
  }, []);

  // Handle point deduction
  const handleDeductPoint = (playerId) => {
    send('deductPoint', { id: playerId, points: game.pointsToDeduct });
    handleArmBuzzers();
  };

  // Handle awarding points
  const handleAwardPoint = (playerId) => {
    send('awardPoint', { id: playerId, points: game.pointsToAdd });
    handleArmBuzzers();
  };

  // Toggle settings visibility
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const handleArmBuzzers = () => {
    send('armBuzzers');
  };

  const handleLockBuzzers = () => {
    send('lockBuzzers');
  };

  // Handle deleting a player
  const handleDelete = (playerId) => {
    send('deletePlayer', { id: playerId });
  };

  // Handle receiving game state updates
  useEffect(() => {
    // Assuming `gameState` is received from the WebSocket or passed down
    const handleGameStateUpdate = (newGameState) => {
      setGame(newGameState); // Update the game state whenever it's updated
    };

    // Listen for game state updates (this is just an example, you'll adapt based on actual data flow)
    // You would need to hook this up to your WebSocket or state management system
    // Example: send a request to update or subscribe to game state from the server
    // For now, we're assuming you can set the game state directly
  }, []); // Empty dependency array to run once on mount

  const allArmed = players.every((p) => p.isArmed);
  const allDisarmed = players.every((p) => !p.isArmed);
  return (
    <div className={styles.screen}>
      <h1>Dashboard</h1>
      {showSoundboard && (
        <div className={styles.soundboard}>
          {soundboardOptions.map((soundName, idx) => (
            <SoundboardButton
              key={idx}
              initialSoundName={soundName}
              showSettings={showSettings}
              soundOptions={soundboardOptions} // pass soundboard options
            />
          ))}
        </div>
      )}

      {players.map((player) => (
        <PlayerRow
          key={player.id}
          buzzed={player.id === game.firstBuzz}
          player={player}
          add={game.pointsToAdd}
          deduct={game.pointsToDeduct}
          handleAdd={handleAwardPoint}
          handleDeduct={handleDeductPoint}
          handleDelete={handleDelete}
          send={send}
          showSettings={showSettings}
          buzzerOptions={buzzerOptions} // ✅ new prop
        />
      ))}

      <div className={styles.footer}>
        <button onClick={handleArmBuzzers} disabled={allArmed}>
          Arm buzzers
        </button>
        <button onClick={handleLockBuzzers} disabled={allDisarmed}>
          Lock buzzers
        </button>
        <button onClick={toggleSettings}>
          {showSettings ? 'Hide Settings' : 'Settings'}
        </button>
      </div>
      {showSettings && (
        <div>
          <Settings
            game={game}
            send={send}
            setGame={setGame}
            showSoundboard={showSoundboard}
            setShowSoundboard={setShowSoundboard}
          />
        </div>
      )}
      <Timer
        isRunning={game.isTimerRunning}
        isShowing={game.isTimerShowing}
        duration={game.timerDuration} // 5 minutes
        resetTrigger={game.resetCount} // change this number to reset
        onComplete={() => console.log('Timer Done')}
      />
    </div>
  );
};

export default Dashboard;
