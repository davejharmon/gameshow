import React, { useEffect } from 'react';
import styles from './css/PlayerScreen.module.css';
import { useParams } from 'react-router';
import classNames from 'classnames';

const PlayerScreen = ({ players, buzzedPlayer, send }) => {
  const { playerId } = useParams();
  const me = players.find((player) => player.id === playerId);

  // Apply conditional class
  const screenClasses = classNames(styles.screen, {
    [styles.buzzed]: buzzedPlayer && me.id === buzzedPlayer.id,
    [styles.disarmed]:
      me && !me.isArmed && (!buzzedPlayer || me.id !== buzzedPlayer.id),
  });

  // Determine if this player is buzzed
  const isBuzzed = buzzedPlayer && me.id === buzzedPlayer.id;

  // Dynamic style for the screen background and text color
  const screenStyle = {
    backgroundColor: isBuzzed ? me.color : 'white',
    color: isBuzzed ? 'black' : me.color,
  };

  // Handle click to buzz in
  const handleClick = () => {
    if (me.isArmed) {
      send('buzz', { id: me.id });
    }
  };

  // Listen for spacebar or enter key press to buzz in
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && me.isArmed) {
        send('buzz', { id: me.id });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [me, send]);

  // If player data is not available, show an error message
  if (!me) {
    return (
      <div className={styles.screen}>
        <h2>Player not found</h2>
      </div>
    );
  }

  return (
    <div className={screenClasses} style={screenStyle} onClick={handleClick}>
      <div className={styles.name}>{me.nickname.toUpperCase()}</div>
      <div className={styles.score}>{me.score}</div>
    </div>
  );
};

export default PlayerScreen;
