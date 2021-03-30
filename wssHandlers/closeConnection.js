const closeConnection = function(serverData, data) {
  const { rooms, activeUsers } = serverData;;
  const { userLeft, room } = data;

  rooms[room].users = rooms[room].users.filter(user => 
    user != userLeft
  );
  Object.values(activeUsers).map(wss => wss.send(JSON.stringify(
        {
      type: 'userLeft',
      data: { oldUserRoom: room, oldUserName: userLeft }
    }
  )));
  delete activeUsers[userLeft];
}

module.exports = closeConnection;