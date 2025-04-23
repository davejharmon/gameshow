import React from 'react';
import classNames from 'classnames';
import styles from './css/PlayerRow.module.css';
import Nickname from './Nickname';

const PlayerRow = ({
  buzzed,
  player,
  add,
  deduct,
  handleAdd,
  handleDeduct,
  rearm,
  handleDelete,
  send,
  showSettings,
}) => {
  // Apply conditional class
  const playerRowClasses = classNames(styles.playerRow, {
    [styles.buzzed]: buzzed,
    [styles.disarmed]: !player.isArmed && !buzzed,
  });

  return (
    <div className={playerRowClasses}>
      <div
        className={styles.playerColor}
        style={{ backgroundColor: player.color }}
      />
      <Nickname player={player} send={send} />
      <div>{player.score}</div>
      <div>
        <button
          onClick={() => {
            handleAdd(player.id);
          }}
        >
          ✔️+{add}
        </button>
        <button
          onClick={() => {
            handleDeduct(player.id);
          }}
        >
          ❌-{deduct}
        </button>
        <button onClick={rearm}>🔒</button>
        {showSettings && (
          <button
            onClick={() => {
              handleDelete(player.id);
            }}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerRow;
