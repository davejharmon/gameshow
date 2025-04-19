import React from 'react';
import classNames from 'classnames'; // Make sure to import classNames
import styles from './css/PlayerRow.module.css';

const PlayerRow = ({ buzzed, player, deletePlayer }) => {
  // Apply conditional class
  const playerRowClasses = classNames(styles.playerRow, {
    [styles.buzzed]: buzzed,
    [styles.disarmed]: !player.isArmed && !buzzed,
  });

  const handleDeleteClick = () => {
    deletePlayer(player.id); // Call the deletePlayer function passed from the parent
  };

  return (
    <div className={playerRowClasses}>
      <div style={{ backgroundColor: player.color }}>🟥</div>
      <div style={{ color: player.color }}>{player.nickname} ✏️</div>
      <div>{player.score}</div>
      <div>
        <button>✔️</button>
        <button>❌</button>
        <button>❌</button>
        <button onClick={handleDeleteClick}>🗑️</button> {/* Delete Button */}
      </div>
    </div>
  );
};

export default PlayerRow;
