import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import PlayerScreen from './PlayerScreen';

const ScreenLoader = ({ players, buzzedPlayer, send, nameSize, scoreSize }) => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundPlayer = players.find((p) => p.id === playerId);
      if (!foundPlayer) {
        navigate('/');
      } else {
        setPlayer(foundPlayer);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [players, playerId, navigate]);

  if (!player) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Player Data...</h2>
      </div>
    );
  }

  return (
    <PlayerScreen
      player={player}
      buzzedPlayer={buzzedPlayer}
      send={send}
      nameSize={nameSize}
      scoreSize={scoreSize}
    />
  );
};

export default ScreenLoader;
