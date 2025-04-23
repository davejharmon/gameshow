import React from 'react';
import classNames from 'classnames';
import styles from './css/PlayerRow.module.css';
import Nickname from './Nickname';
import Score from './Score';

const PlayerRow = ({
  buzzed,
  player,
  add,
  deduct,
  handleAdd,
  handleDeduct,
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
      <Score player={player} send={send} />
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
