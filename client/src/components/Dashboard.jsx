import React, { useState } from 'react';
import ConnectionStatus from './ConnectionStatus';
import Settings from './Settings';
import styles from './css/Dashboard.module.css';
import PlayerRow from './PlayerRow';

const Dashboard = ({ game, players, send }) => {
  const [pointValue, setPointValue] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

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

  // Add new player to the game
  const handleAddPlayer = () => {
    send('addPlayer');
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

  const allArmed = players.every((p) => p.isArmed);
  const allDisarmed = players.every((p) => !p.isArmed);

  return (
    <div className={styles.screen}>
      <h1>Dashboard</h1>
      {players.map((player) => (
        <PlayerRow
          key={player.id}
          buzzed={player.id === game.firstBuzz}
          player={player}
          add={game.pointsToAdd}
          deduct={game.pointsToDeduct}
          handleAdd={handleAwardPoint}
          handleDeduct={handleDeductPoint}
          rearm={handleArmBuzzers}
          handleDelete={handleDelete} // Pass deletePlayer function as a prop
          send={send}
          showSettings={showSettings}
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
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>
      {showSettings && (
        <Settings
          pointValue={pointValue}
          setPointValue={setPointValue}
          send={send}
        />
      )}
    </div>
  );
};

export default Dashboard;
