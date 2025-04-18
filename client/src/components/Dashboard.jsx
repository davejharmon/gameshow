import React from 'react';
import ConnectionStatus from './ConnectionStatus';

const Dashboard = ({
  scores,
  send,
  firstBuzz,
  connectionStatus,
  reconnect,
}) => {
  const handleDeductPoint = (player) => {
    console.log(`Sending deduct point for: ${player}`); // Debugging log
    send('deductPoint', { player }); // Sending deductPoint message
  };

  return (
    <div>
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
              onClick={() => send('awardPoint', { player })}
              style={{
                backgroundColor: isFirstBuzzed ? 'gold' : 'transparent',
                fontWeight: isFirstBuzzed ? 'bold' : 'normal',
              }}
            >
              +1
            </button>
            <button onClick={() => handleDeductPoint(player)}>-1</button>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
