/**
 * Handler for messages sent by users
 * 1. Form a complete message object containing id, sendername, message 
 *    and add a timestamp.
 * 2. Add the message object to the history of room to which it was sent
 * 3. Send the message object to all connections, including initial sender
 * @param {*} serverData 
 * @param {*} data 
 */
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