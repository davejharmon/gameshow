import React, { useEffect, useMemo } from 'react';
import styles from './css/PlayerScreen.module.css';
import { useParams, useNavigate } from 'react-router';
import classNames from 'classnames';

const PlayerScreen = ({
  players,
  buzzedPlayer,
  send,
  nameSize = 24,
  scoreSize = 36,
}) => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const me = useMemo(() => {
    return players.find((p) => p.id === playerId);
  }, [players, playerId]);

  // Redirect if player data hasn't loaded within 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!me) {
        navigate('/');
      }
    }, 3000);

    return () => clearTimeout(timer); // Clean up on unmount
  }, [me, navigate]);

  // Keydown listener for buzzing in
  useEffect(() => {
    if (me) {
      const handleKeyDown = (e) => {
        if ((e.code === 'Space' || e.code === 'Enter') && me.isArmed) {
          send('buzz', { id: me.id });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [me, send]);

  if (!me) {
    return (
      <div className={styles.screen}>
        <h2>Loading Player Data...</h2>
      </div>
    );
  }

  const screenClasses = classNames(styles.screen, {
    [styles.buzzed]: buzzedPlayer && me.id === buzzedPlayer.id,
    [styles.disarmed]:
      me && !me.isArmed && (!buzzedPlayer || me.id !== buzzedPlayer.id),
  });

  const isBuzzed = buzzedPlayer && me.id === buzzedPlayer.id;

  const screenStyle = {
    backgroundColor: isBuzzed ? me.color : 'white',
    color: isBuzzed ? 'black' : me.color,
  };

  const handleClick = () => {
    if (me.isArmed) {
      send('buzz', { id: me.id });
    }
  };
  return (
    <div className={screenClasses} style={screenStyle} onClick={handleClick}>
      <div
        className={styles.name}
        style={{
          backgroundColor: me.color,
          fontSize: `${nameSize}vw`,
        }}
      >
        {me.nickname}
      </div>
      <div
        className={styles.score}
        style={{
          fontSize: `${scoreSize}vw`,
        }}
      >
        {me.score}
      </div>
    </div>
  );
};

export default PlayerScreen;
