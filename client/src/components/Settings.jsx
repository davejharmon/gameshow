import React from 'react';

const Settings = ({ pointValue, setPointValue, send }) => {
  const handleResetGame = () => {
    send('resetGame');
  };

  return (
    <div
      style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}
    >
      <h3>Settings</h3>

      <div>
        <label htmlFor='pointValue'>Set Points for Award/Deduct</label>
        <input
          type='number'
          id='pointValue'
          value={pointValue}
          min='1'
          onChange={(e) => setPointValue(parseInt(e.target.value))}
        />
      </div>

      <button onClick={handleResetGame}>Reset Game</button>
    </div>
  );
};

export default Settings;
