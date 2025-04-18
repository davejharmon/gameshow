import React from 'react';
import { ReadyState } from 'react-use-websocket';
import ConnectionStatus from './ConnectionStatus';

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

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>{role.toUpperCase()}</h1>
      <h2>Score: {scores[role]}</h2>

      {isBuzzedIn && (
        <div style={{ color: 'gold', fontWeight: 'bold', fontSize: '1.5rem' }}>
          YOU BUZZED FIRST!
        </div>
      )}

      {canBuzz && (
        <button
          onClick={() => send('buzz', { player: role })}
          style={{
            fontSize: '2rem',
            padding: '1rem 2rem',
            marginTop: '2rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          Buzz!
        </button>
      )}

      <div style={{ marginTop: '2rem' }}>
        <ConnectionStatus status={connectionStatus} onReconnect={reconnect} />
      </div>
    </div>
  );
};

export default PlayerScreen;
