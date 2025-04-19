import { useMemo } from 'react';

export function useGameSounds() {
  const sounds = useMemo(() => {
    const buzz = new Audio('/sounds/buzzer.wav');
    const incorrect = new Audio('/sounds/incorrect.mp3');
    const correct = new Audio('/sounds/correct.mp3');
    const win = new Audio('/sounds/win.mp3');

    buzz.volume = 1;
    incorrect.volume = 0.6;
    correct.volume = 0.8;
    win.volume = 1;

    return {
      playBuzz: () => {
        console.log('🎵 Playing 🔔 Buzz sound');
        buzz.play().catch((e) => console.warn('Failed to play buzz sound:', e));
      },
      playIncorrect: () => {
        console.log('🎵 Playing ❌ Incorrect sound');
        incorrect
          .play()
          .catch((e) => console.warn('Failed to play reset sound:', e));
      },
      playCorrect: () => {
        console.log('🎵 Playing ✔️ Correct sound');
        correct
          .play()
          .catch((e) => console.warn('Failed to play point sound:', e));
      },
      playWin: () => {
        console.log('🎵 Playing Win sound');
        win.play().catch((e) => console.warn('Failed to play win sound:', e));
      },
    };
  });

  // fallback to no-ops if not operator
  return {
    playBuzz: sounds.playBuzz || (() => {}),
    playIncorrect: sounds.playIncorrect || (() => {}),
    playCorrect: sounds.playCorrect || (() => {}),
    playWin: sounds.playWin || (() => {}),
  };
}
