import React from 'react';
import classNames from 'classnames';
import styles from './css/PlayerRow.module.css';

const PlayerRow = ({
  buzzed,
  player,
  add,
  deduct,
  handleAdd,
  handleDeduct,
  rearm,
  handleDelete,
}) => {
  // Apply conditional class
  const playerRowClasses = classNames(styles.playerRow, {
    [styles.buzzed]: buzzed,
    [styles.disarmed]: !player.isArmed && !buzzed,
  });

  return (
    <div className={playerRowClasses}>
      <div style={{ backgroundColor: player.color }}>🟥</div>
      <div style={{ color: player.color }}>{player.nickname} ✏️</div>
      <div>{player.score}</div>
      <div>
        <button
          onClick={() => {
            handleAdd(player.id);
          }}
        >
          ✔️+{add}
        </button>
        <button onClick={rearm}>❌</button>
        <button
          onClick={() => {
            handleDeduct(player.id);
          }}
        >
          ❌-{deduct}
        </button>
        <button
          onClick={() => {
            handleDelete(player.id);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default PlayerRow;
