import PlayerScreenDumb from './PlayerScreenDumb'; // make sure the path is correct
import Timer from './Timer';
import styles from './css/Screen.module.css';
const Screen = ({
  players,
  buzzedPlayer,
  send,
  nameSize,
  scoreSize,
  timer,
}) => {
  console.log(timer);
  return (
    <div className={styles.screenContainer}>
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
      <Timer
        isRunning={timer.isTimerRunning}
        isShowing={timer.isTimerShowing}
        duration={timer.timerDuration} // 5 minutes
        resetTrigger={timer.resetCount} // change this number to reset
        onComplete={() => console.log('Timer Done')}
      />
    </div>
  );
};

export default Screen;
