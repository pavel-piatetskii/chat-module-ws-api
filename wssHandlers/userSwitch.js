/**
 * Handler for a user which switches from one room to another
 * 1. Delete a username from the current room
 * 2. Send information about that to all connections
 * 3. Add username to a new room
 * 4. Send information about that to all connections
 * @param {*} serverData 
 * @param {*} data 
 */
const userSwitch = function (serverData, data) {

  const { rooms, activeUsers } = serverData;
  const { userSwitch, oldRoom, newRoom } = data;

  rooms[oldRoom].users = rooms[oldRoom].users.filter(user => 
    user != userSwitch
  );

  Object.values(activeUsers).map(wss => wss.send(JSON.stringify(
    {
      type: 'userLeft',
      data: { oldUserRoom: oldRoom, oldUserName: userSwitch }
    }
  )));

  rooms[newRoom].users.push(userSwitch);
  Object.values(activeUsers).map(wss => wss.send(JSON.stringify(
    {
      type: 'newUser',
      data: { newUserRoom: newRoom, newUserName: userSwitch }
    }
  )));
};

module.exports = userSwitch;