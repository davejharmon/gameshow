import { useEffect, useMemo, useState } from 'react';

function createAudioPlayer(variantPaths) {
  return () => {
    if (!variantPaths || variantPaths.length === 0) {
      console.warn('No audio variants available');
      return;
    }

    const randomSrc =
      variantPaths[Math.floor(Math.random() * variantPaths.length)];
    console.log(`Playing sound: ${randomSrc}`);
    const audio = new Audio(randomSrc);

    audio.addEventListener(
      'error',
      () => {
        console.warn(`Error loading sound: ${randomSrc}`);
      },
      { once: true }
    );

    audio.play().catch(console.warn);
  };
}

export function useGameSounds() {
  const [soundMap, setSoundMap] = useState({});

  useEffect(() => {
    fetch('/sounds/manifest.json')
      .then((res) => res.json())
      .then((manifest) => {
        const newMap = {};

        for (const [key, files] of Object.entries(manifest)) {
          newMap[key] = files.map((filename) => `/sounds/${key}/${filename}`);
        }

        setSoundMap(newMap);
      })
      .catch((err) => {
        console.error('Failed to load sound manifest:', err);
      });
  }, []);

  const play = useMemo(() => {
    return (key) => {
      const variants = soundMap[key];
      if (!variants) {
        console.warn(`No sound variants found for key: ${key}`);
        return;
      }
      createAudioPlayer(variants)();
    };
  }, [soundMap]);

  const playFile = (filePath) => {
    if (!filePath) {
      console.warn('No file path provided to playFile');
      return;
    }
    console.log(`Playing file: ${filePath}`);
    const audio = new Audio(filePath);
    audio.play().catch(console.warn);
  };

  return { play, playFile };
}
