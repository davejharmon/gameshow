import React, { useEffect } from 'react';
import { ReadyState } from 'react-use-websocket';
import ConnectionStatus from './ConnectionStatus';
import styles from './css/PlayerScreen.module.css';

const PlayerScreen = ({
  role,
  scores,
  buzzedPlayer,
  send,
  connectionStatus,
  reconnect,
}) => {
  const isBuzzedIn = buzzedPlayer === role;
  const canBuzz = !buzzedPlayer;

  const handleClick = () => {
    if (canBuzz) {
      send('buzz', { player: role });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && canBuzz) {
        send('buzz', { player: role });
      }
    };

    // Add event listener for space/enter keys
    window.addEventListener('keydown', handleKeyDown);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canBuzz, role, send]);

  return (
    <div
      className={styles.screen}
      onClick={handleClick} // Trigger buzz on screen click
      style={{
        backgroundColor: isBuzzedIn ? 'gold' : 'initial',
      }}
    >
      <div className={styles.name}>{role.toUpperCase()}</div>
      <div className={styles.score}>{scores[role]}</div>

      <ConnectionStatus status={connectionStatus} onReconnect={reconnect} />
    </div>
  );
};

export default PlayerScreen;
