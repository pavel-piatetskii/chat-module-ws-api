const newMessage = function(serverData, data) {

  const { rooms, connections } = serverData;
  const { sender, newMessage, room } = data;
  const messageToSave = {
    id: rooms[room].history.length,
    sender,
    message: newMessage,
    time: new Date(),
  };
  rooms[room].history.push(messageToSave);
  connections.map(wss =>
    wss.send(JSON.stringify({
      type: 'newMessage',
      data: { messageToSave, room }
    }))
  );

};

module.exports = newMessage;