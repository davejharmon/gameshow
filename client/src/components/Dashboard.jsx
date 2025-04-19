import React, { useState } from 'react';
import ConnectionStatus from './ConnectionStatus';
import styles from './css/Dashboard.module.css';
const Dashboard = ({
  scores,
  send,
  firstBuzz,
  connectionStatus,
  reconnect,
}) => {
  const [pointValue, setPointValue] = useState(1); // State to control points for award/deduct

  const handleDeductPoint = (player) => {
    console.log(`Sending deduct point for: ${player}`); // Debugging log
    send('deductPoint', { player, points: pointValue }); // Sending deductPoint message with points value
  };

  const handleAwardPoint = (player) => {
    console.log(`Sending award point for: ${player}`); // Debugging log
    send('awardPoint', { player, points: pointValue }); // Sending awardPoint message with points value
  };

  return (
    <div className={styles.screen}>
      <h1>Dashboard</h1>
      <ConnectionStatus status={connectionStatus} onReconnect={reconnect} />

      <button onClick={() => send('armBuzzers')}>Arm Buzzers</button>

      <h2>Scores</h2>
      {console.log('firstBuzz:', firstBuzz)}
      {Object.entries(scores).map(([player, score]) => {
        const isFirstBuzzed = firstBuzz === player;
        return (
          <div key={player}>
            {player}: {score}
            <button
              onClick={() => handleAwardPoint(player)}
              style={{
                backgroundColor: isFirstBuzzed ? 'gold' : 'transparent',
                fontWeight: isFirstBuzzed ? 'bold' : 'normal',
              }}
            >
              +{pointValue}
            </button>
            <button onClick={() => handleDeductPoint(player)}>
              -{pointValue}
            </button>
          </div>
        );
      })}

      {/* Settings for controlling points */}
      <div>
        <h3>Set Points for Award/Deduct</h3>
        <input
          type='number'
          value={pointValue}
          min='1'
          onChange={(e) => setPointValue(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Dashboard;
