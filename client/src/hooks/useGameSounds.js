import { useMemo } from 'react';

function createAudioWithFallback(basePath) {
  const audio = new Audio();
  audio.src = `${basePath}.mp3`;

  const fallback = () => {
    // On error, switch to .wav
    audio.src = `${basePath}.wav`;
    audio.load();
  };

  // Try .mp3 first, fallback to .wav if it fails to load
  audio.addEventListener('error', fallback, { once: true });

  return audio;
}

export function useGameSounds() {
  const sounds = useMemo(() => {
    const buzz = createAudioWithFallback('/sounds/buzzer');
    const incorrect = createAudioWithFallback('/sounds/incorrect');
    const correct = createAudioWithFallback('/sounds/correct');
    const win = createAudioWithFallback('/sounds/win');
    const sound1 = createAudioWithFallback('/sounds/sound1');
    const sound2 = createAudioWithFallback('/sounds/sound2');
    const sound3 = createAudioWithFallback('/sounds/sound3');
    const sound4 = createAudioWithFallback('/sounds/sound4');
    const sound5 = createAudioWithFallback('/sounds/sound5');
    const sound6 = createAudioWithFallback('/sounds/sound6');

    return {
      playBuzz: () => buzz.play().catch(console.warn),
      playIncorrect: () => incorrect.play().catch(console.warn),
      playCorrect: () => correct.play().catch(console.warn),
      playWin: () => win.play().catch(console.warn),
      playSound1: () => sound1.play().catch(console.warn),
      playSound2: () => sound2.play().catch(console.warn),
      playSound3: () => sound3.play().catch(console.warn),
      playSound4: () => sound4.play().catch(console.warn),
      playSound5: () => sound5.play().catch(console.warn),
      playSound6: () => sound6.play().catch(console.warn),
    };
  }, []);

  return sounds;
}
