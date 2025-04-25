import React from 'react';
import classNames from 'classnames';
import styles from './css/playerScreenDumb.module.css';

const PlayerScreenDumb = ({
  player,
  buzzedPlayer,
  nameSize = 100, // percentage of container width
  scoreSize = 100, // percentage of container width
}) => {
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

  return (
    <div className={screenClasses} style={screenStyle}>
      <div
        className={styles.name}
        style={{
          backgroundColor: player.color,
          fontSize: `${nameSize}%`,
        }}
      >
        {player.nickname}
      </div>
      <div
        className={styles.score}
        style={{
          fontSize: `${scoreSize}%`,
        }}
      >
        {player.score}
      </div>
    </div>
  );
};

export default PlayerScreenDumb;
