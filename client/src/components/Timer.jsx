import React, { useEffect, useRef, useState } from 'react';
import styles from './css/Screen.module.css'; // Reuse styling

const Timer = ({
  isRunning,
  isShowing,
  duration,
  onComplete,
  resetTrigger,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration); // update when duration changes
  }, [duration]);

  useEffect(() => {
    if (resetTrigger !== undefined) {
      setTimeLeft(duration);
      clearInterval(intervalRef.current);
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (isRunning) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              if (onComplete) onComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  if (!isShowing) {
    return null; // don't render anything if timer is hidden
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className={`${styles.timer} ${timeLeft <= 60 ? styles.timerWarning : ''}`}
    >
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
