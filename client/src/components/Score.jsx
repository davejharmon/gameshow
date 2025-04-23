import { useState } from 'react';

const Score = ({ player, send }) => {
  const [score, setScore] = useState(player.score.toString());
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setScore(newValue);
    }
  };

  const handleFocus = () => {
    setScore('');
  };

  const handleBlur = () => {
    if (score === '') {
      setScore(player.score.toString());
    } else {
      const numericScore = parseInt(score, 10);
      if (!isNaN(numericScore) && numericScore !== player.score) {
        send('setScore', { id: player.id, score: numericScore });
      }
    }
    setEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div onClick={() => setEditing(true)}>
      {editing ? (
        <input
          type='text'
          value={score}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <span>{player.score}</span>
      )}
    </div>
  );
};

export default Score;
