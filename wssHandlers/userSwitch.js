const userSwitch = function (serverData, data) {

  const { rooms, connections } = serverData;
  const { userSwitch, oldRoom, newRoom } = data;

  rooms[oldRoom].users = rooms[oldRoom].users.filter(user => 
    user != userSwitch
  );

  connections.map(wss => wss.send(JSON.stringify(
    {
      type: 'userLeft',
      data: { oldUserRoom: oldRoom, oldUserName: userSwitch }
    }
  )));

  rooms[newRoom].users.push(userSwitch);
  connections.map(wss => wss.send(JSON.stringify(
    {
      type: 'newUser',
      data: { newUserRoom: newRoom, newUserName: userSwitch }
    }
  )));
};

module.exports = userSwitch;