import React from 'react';

const CONNECTION_TEXT = {
  0: 'Connecting...',
  1: 'Connected',
  2: 'Closing...',
  3: 'Disconnected — Reconnect',
};

const CONNECTION_COLOR = {
  0: 'orange',
  1: 'green',
  2: 'orange',
  3: 'red',
};

export default function ConnectionStatus({ status, onReconnect }) {
  const isClickable = status === 3; // Only allow click if disconnected

  return (
    <button
      onClick={isClickable ? onReconnect : undefined}
      style={{
        backgroundColor: CONNECTION_COLOR[status],
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '6px',
        cursor: isClickable ? 'pointer' : 'default',
        marginBottom: '1rem',
        fontWeight: 'bold',
      }}
      disabled={!isClickable} // Visually disables it unless disconnected
    >
      {CONNECTION_TEXT[status]}
    </button>
  );
}
