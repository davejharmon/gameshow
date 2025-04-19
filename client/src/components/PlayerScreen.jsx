import React, { useEffect } from 'react';
import ConnectionStatus from './ConnectionStatus';
import styles from './css/PlayerScreen.module.css';
import { useParams } from 'react-router';

const PlayerScreen = ({ players, send, connectionStatus, reconnect }) => {
  const { playerId } = useParams();
  const me = players.find((player) => player.id === playerId);
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
    <div
      className={styles.screen}
      style={{ backgroundColor: me.color }}
      onClick={handleClick}
    >
      <div className={styles.name}>{me.nickname.toUpperCase()}</div>
      <div className={styles.score}>{me.score}</div>
    </div>
  );
};

export default PlayerScreen;
