import React, { useEffect, useMemo } from 'react';
import styles from './css/PlayerScreen.module.css';
import { useParams } from 'react-router';
import classNames from 'classnames';

const PlayerScreen = ({ players, buzzedPlayer, send }) => {
  const { playerId } = useParams();
  const me = useMemo(() => {
    return players.find((p) => p.id === playerId);
  }, [players, playerId]);

  // Protect against undefined player data by checking it in the effect itself
  useEffect(() => {
    if (me) {
      const handleKeyDown = (e) => {
        if ((e.code === 'Space' || e.code === 'Enter') && me.isArmed) {
          send('buzz', { id: me.id });
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [me, send]); // Only trigger when `me` or `send` changes

  // If player data is not yet loaded or found, show loading or error message
  if (!me) {
    return (
      <div className={styles.screen}>
        <h2>Loading Player Data...</h2> {/* Or use a fallback message */}
      </div>
    );
  }

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

  return (
    <div className={screenClasses} style={screenStyle} onClick={handleClick}>
      <div className={styles.name} style={{ backgroundColor: me.color }}>
        {me.nickname.toUpperCase()}
      </div>
      <div className={styles.score}>{me.score}</div>
    </div>
  );
};

export default PlayerScreen;
