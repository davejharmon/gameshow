import { useState } from 'react';

const Nickname = (props) => {
  const { player, send } = props;
  const [name, setName] = useState(player.nickname);
  const [editing, setEditing] = useState(false);

  const handleSave = (e) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    // Send the WebSocket message with the updated nickname
    if (name !== player.nickname) {
      send('editNickname', { id: player.id, newNickname: name });
    }
    setEditing(false);
  };

  const handleKeyPress = (e) => {
    // Optionally, handle the "Enter" key to save the nickname immediately
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div onClick={() => setEditing(true)} style={{ color: player.color }}>
      {editing ? (
        <input
          type='text'
          value={name}
          onChange={handleSave}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <span>{name}</span>
      )}
    </div>
  );
};

export default Nickname;
