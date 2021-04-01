/**
 * If a user closes a connection
 * 1. User's name is deleted from the room he was in
 * 2. User's connection is deleted from activeUsers object
 * 3. A message 'userLeft' is sent to all other connections
 */ 
 const closeConnection = function(serverData, data) {
  const { rooms, activeUsers } = serverData;
  const { userLeft, room } = data;

  rooms[room].users = rooms[room].users.filter(user => 
    user != userLeft
  );
  delete activeUsers[userLeft];
  Object.values(activeUsers).map(wss => wss.send(JSON.stringify(
        {
      type: 'userLeft',
      data: { oldUserRoom: room, oldUserName: userLeft }
    }
  )));
}

module.exports = closeConnection;