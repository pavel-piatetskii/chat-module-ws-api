const closeConnection = function(serverData, data, server) {
  const { rooms, namelist, connections } = serverData;;
  const { userLeft, room } = data;

  rooms[room].users = rooms[room].users.filter(user => 
    user != userLeft
  );
  server.clients.forEach(wss => wss.send(JSON.stringify(
        {
      type: 'userLeft',
      data: { oldUserRoom: room, oldUserName: userLeft }
    }
  )));
  namelist.filter(user => user !== userLeft);
}

module.exports = closeConnection;