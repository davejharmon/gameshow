import React from 'react';

const LandingPage = () => {
  const redirectToRole = (role) => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', role);
    window.location.href = url.toString();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Game Show</h1>
      <p>Select your role:</p>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => redirectToRole('operator')}
        >
          Operator
        </button>
        <button style={styles.button} onClick={() => redirectToRole('player1')}>
          Player 1
        </button>
        <button style={styles.button} onClick={() => redirectToRole('player2')}>
          Player 2
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    transition: 'background-color 0.2s',
  },
};

export default LandingPage;
