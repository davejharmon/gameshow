import React, { useState, useEffect } from 'react';
import styles from './css/SoundboardButton.module.css'; // optional styling
import { useGameSounds } from '../hooks/useGameSounds';

const SoundboardButton = ({
  initialSoundName,
  showSettings,
  soundOptions = [], // array of string sound names to select from
}) => {
  const [soundName, setSoundName] = useState(initialSoundName);
  const [label, setLabel] = useState(initialSoundName);
  const { playFile } = useGameSounds();
  // When soundName changes, update label to match it (or keep label as soundName)
  useEffect(() => {
    setLabel(soundName);
  }, [soundName]);

  // Handler for button click to play sound
  const handlePlay = () => {
    if (playFile && soundName) {
      playFile(`/sounds/soundboard/${soundName}`);
    }
  };

  // Handler for select change
  const handleSelectChange = (e) => {
    setSoundName(e.target.value);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handlePlay}>
        {label}
      </button>

      {showSettings && (
        <select
          value={soundName}
          onChange={handleSelectChange}
          className={styles.select}
          title='Select sound'
        >
          <option value=''>-- Select sound --</option>
          {soundOptions.map((sound) => (
            <option key={sound} value={sound}>
              {sound}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SoundboardButton;
