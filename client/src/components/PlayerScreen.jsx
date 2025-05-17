import React, { useEffect } from 'react';
import styles from './css/PlayerScreen.module.css';
import classNames from 'classnames';

const PlayerScreen = ({
  player,
  buzzedPlayer,
  send,
  nameSize = 24,
  scoreSize = 36,
}) => {
  // Keydown listener for buzzing in
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && player.isArmed) {
        send('buzz', { id: player.id });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, send]);

  if (!player) {
    return (
      <div className={styles.screen}>
        <h2>Loading Player Data...</h2>
      </div>
    );
  }
  const isBuzzed = buzzedPlayer && player.id === buzzedPlayer.id;

  const screenClasses = classNames(styles.screen, {
    [styles.buzzed]: isBuzzed,
    [styles.disarmed]:
      !player.isArmed && (!buzzedPlayer || player.id !== buzzedPlayer.id),
  });

  const screenStyle = {
    backgroundColor: isBuzzed ? player.color : 'white',
    color: isBuzzed ? 'black' : player.color,
  };

  const handleClick = () => {
    if (player.isArmed) {
      send('buzz', { id: player.id });
    }
  };

  return (
    <div className={screenClasses} style={screenStyle} onClick={handleClick}>
      <div
        className={styles.name}
        style={{
          backgroundColor: player.color,
          fontSize: `${nameSize}vw`,
        }}
      >
        {player.nickname}
      </div>
      <div
        className={styles.score}
        style={{
          fontSize: `${scoreSize}vw`,
        }}
      >
        {player.score}
      </div>
    </div>
  );
};

export default PlayerScreen;
