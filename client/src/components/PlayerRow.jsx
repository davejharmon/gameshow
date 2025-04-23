import React, { useState, useEffect } from 'react';
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
  // Local state for the color‐picker’s current value
  const [tempColor, setTempColor] = useState(player.color);

  // @sync whenever server‐driven player.color changes (e.g. on other clients’ updates)
  useEffect(() => {
    setTempColor(player.color);
  }, [player.color]);

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
        <button onClick={() => handleAdd(player.id)}>✔️+{add}</button>
        <button onClick={() => handleDeduct(player.id)}>❌-{deduct}</button>

        {showSettings && (
          <>
            <button onClick={() => handleDelete(player.id)}>🗑️</button>
            <input
              type='color'
              value={tempColor} // controlled by tempColor
              onChange={(e) => setTempColor(e.target.value)} // update local state only
              onBlur={() =>
                send('setPlayerColor', {
                  id: player.id,
                  color: tempColor, // send only when picker closes
                })
              }
              title='Change player color'
              style={{ marginLeft: '0.5rem' }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerRow;
