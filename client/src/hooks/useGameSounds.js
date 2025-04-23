import { useMemo } from 'react';

function createAudioWithFallback(basePath) {
  return () => {
    const audio = new Audio(`${basePath}.mp3`);

    audio.addEventListener(
      'error',
      (e) => {
        console.log(`MP3 not found for ${basePath}. Falling back to WAV.`);
        audio.src = `${basePath}.wav`;
        audio.load();
        audio.play().catch(console.warn);
      },
      { once: true }
    );

    audio.play().catch(console.warn);
  };
}

export function useGameSounds() {
  const sounds = useMemo(
    () => ({
      playBuzz: createAudioWithFallback('/sounds/buzzer'),
      playIncorrect: createAudioWithFallback('/sounds/incorrect'),
      playCorrect: createAudioWithFallback('/sounds/correct'),
      playWin: createAudioWithFallback('/sounds/win'),
      playSound1: createAudioWithFallback('/sounds/sound1'),
      playSound2: createAudioWithFallback('/sounds/sound2'),
      playSound3: createAudioWithFallback('/sounds/sound3'),
      playSound4: createAudioWithFallback('/sounds/sound4'),
      playSound5: createAudioWithFallback('/sounds/sound5'),
      playSound6: createAudioWithFallback('/sounds/sound6'),
    }),
    []
  );

  return sounds;
}
