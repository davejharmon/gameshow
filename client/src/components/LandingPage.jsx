import React from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './css/LandingPage.module.css';
const LandingPage = ({ players }) => {
  const { '*': splat } = useParams();
  let navigate = useNavigate();
  return (
    <div>
      <h1>🎉 Welcome to the Game Show 🎉</h1>
      <p>Select your role to begin:</p>

      <div>
        <h2>Dashboard</h2>
        <button onClick={() => navigate('/dashboard')}>
          Operator Dashboard
        </button>
      </div>

      <div>
        <h2>Players</h2>
        <div>
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => navigate(`/players/${player.id}`)}
            >
              {player.nickname}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
