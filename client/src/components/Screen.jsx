import PlayerScreenDumb from './PlayerScreenDumb'; // make sure the path is correct
import styles from './css/Screen.module.css';
const Screen = ({ players, buzzedPlayer, send, nameSize, scoreSize }) => {
  return (
    <div className={styles.screenGrid}>
      {players.map((player) => (
        <div key={player.id}>
          <PlayerScreenDumb
            player={player}
            buzzedPlayer={buzzedPlayer}
            send={send}
            nameSize={nameSize}
            scoreSize={scoreSize}
          />
        </div>
      ))}
    </div>
  );
};

export default Screen;
