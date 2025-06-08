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
  buzzerOptions = ['Buzzer 1', 'Buzzer 2', 'Buzzer 3', 'buzzer'],
}) => {
  const [tempColor, setTempColor] = useState(player.color);
  const [tempBuzzer, setTempBuzzer] = useState(player.buzzer || '');

  useEffect(() => setTempColor(player.color), [player.color]);
  useEffect(() => setTempBuzzer(player.buzzer || ''), [player.buzzer]);

  const playerRowClasses = classNames(styles.playerRow, {
    [styles.buzzed]: buzzed,
    [styles.disarmed]: !player.isArmed && !buzzed,
  });

  const handleColorBlur = () =>
    send('setPlayerColor', { id: player.id, color: tempColor });

  const handleBuzzerBlur = () =>
    send('setPlayerBuzzer', { id: player.id, buzzer: tempBuzzer });
  console.log(player);
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
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              onBlur={handleColorBlur}
              title='Change player color'
              style={{ marginLeft: '0.5rem' }}
            />

            <select
              value={tempBuzzer}
              onChange={(e) => setTempBuzzer(e.target.value)}
              onBlur={handleBuzzerBlur}
              title='Select player buzzer'
              style={{ marginLeft: '0.5rem' }}
            >
              {!player.buzzer && <option value=''>-- Select buzzer --</option>}
              {buzzerOptions.map((buzzer) => (
                <option key={buzzer} value={buzzer}>
                  {buzzer}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerRow;
