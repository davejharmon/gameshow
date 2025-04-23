import React, { useState, useEffect } from 'react';
import styles from './css/Settings.module.css';

const Settings = ({
  game,
  send,
  setGame,
  showSoundboard,
  setShowSoundboard,
}) => {
  const [localNameSize, setLocalNameSize] = useState(game.nameSize || 16);
  const [localScoreSize, setLocalScoreSize] = useState(game.scoreSize || 24);

  useEffect(() => {
    setLocalNameSize(game.nameSize || 16);
    setLocalScoreSize(game.scoreSize || 24);
  }, [game.nameSize, game.scoreSize]);

  const handleSetPointsToAdd = (value) => {
    if (!isNaN(value)) {
      send('setPointsToAdd', { value });
      setGame((prev) => ({ ...prev, pointsToAdd: value }));
    }
  };

  const handleSetPointsToDeduct = (value) => {
    if (!isNaN(value)) {
      send('setPointsToDeduct', { value });
      setGame((prev) => ({ ...prev, pointsToDeduct: value }));
    }
  };

  const handleNameSizeChange = (value) => {
    if (!isNaN(value)) {
      send('setNameSize', { size: value });
      setGame((prev) => ({ ...prev, nameSize: value }));
    }
  };

  const handleScoreSizeChange = (value) => {
    if (!isNaN(value)) {
      send('setScoreSize', { size: value });
      setGame((prev) => ({ ...prev, scoreSize: value }));
    }
  };

  return (
    <div className={styles.container}>
      <h3>Settings</h3>
      <div className={styles.grid}>
        <div className={styles.settingItem}>
          <label htmlFor='pointsToAdd'>Points for ✔️:</label>
          <input
            type='number'
            id='pointsToAdd'
            value={game.pointsToAdd}
            min='1'
            onChange={(e) => handleSetPointsToAdd(parseInt(e.target.value))}
            className={styles.inputNarrow}
          />
        </div>

        <div className={styles.settingItem}>
          <label htmlFor='pointsToDeduct'>Points for ❌:</label>
          <input
            type='number'
            id='pointsToDeduct'
            value={game.pointsToDeduct}
            min='1'
            onChange={(e) => handleSetPointsToDeduct(parseInt(e.target.value))}
            className={styles.inputNarrow}
          />
        </div>

        <div className={styles.settingItem}>
          <label htmlFor='nameSize'>Name Size: {localNameSize}vh</label>
          <div className={styles.inlineInput}>
            <input
              type='range'
              id='nameSize'
              min='1'
              max='100'
              value={localNameSize}
              onChange={(e) => setLocalNameSize(parseInt(e.target.value))}
              onMouseUp={() => handleNameSizeChange(localNameSize)}
            />
            <input
              type='number'
              min='1'
              max='100'
              value={localNameSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLocalNameSize(val);
                handleNameSizeChange(val);
              }}
              className={styles.inputNarrow}
            />
          </div>
        </div>

        <div className={styles.settingItem}>
          <label htmlFor='scoreSize'>Score Size: {localScoreSize}vh</label>
          <div className={styles.inlineInput}>
            <input
              type='range'
              id='scoreSize'
              min='1'
              max='100'
              value={localScoreSize}
              onChange={(e) => setLocalScoreSize(parseInt(e.target.value))}
              onMouseUp={() => handleScoreSizeChange(localScoreSize)}
            />
            <input
              type='number'
              min='1'
              max='100'
              value={localScoreSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLocalScoreSize(val);
                handleScoreSizeChange(val);
              }}
              className={styles.inputNarrow}
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button onClick={() => send('addPlayer')}>Add Player</button>
          <button onClick={() => send('resetScores')}>Reset Scores</button>
          <button onClick={() => send('resetGame')}>Reset Game</button>
          <button onClick={() => setShowSoundboard((prev) => !prev)}>
            {showSoundboard ? 'Hide Soundboard' : 'Show Soundboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
