import React from 'react';
import styles from './css/ConnectionStatus.module.css';
const CONNECTION_TEXT = {
  0: '🟡',
  1: '🟢',
  2: '🟡',
  3: '🔴',
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
      className={styles.connectionStatus}
      onClick={isClickable ? onReconnect : undefined}
      disabled={!isClickable} // Visually disables it unless disconnected
    >
      {CONNECTION_TEXT[status]}
    </button>
  );
}
