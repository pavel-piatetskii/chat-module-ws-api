const newUser = function (serverData, wss, data) {

  const { rooms, namelist, connections } = serverData;
  const { username, room } = data;
  if (!namelist.includes(username)) {
    namelist.push(username);
    rooms[room].users.push(username);
    wss.send(JSON.stringify({
      type: 'init',
      data: { username, roomsData: rooms }
    }));
    connections.map(wss => wss.send(JSON.stringify(
      {
        type: 'newUser',
        data: { newUserRoom: room, newUserName: username }
      }
    )));
    connections.push(wss);
    console.log(connections.length)
  } else {
    wss.send(JSON.stringify({
      type: 'userExist'
    }));
  };
};

module.exports = { newUser };