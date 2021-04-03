/**
 * Handler for new user trying to enter the chat
 * 1. Checks if the name user chose already exist (namelist)
 * 2. If the name is available, sends full chat rooms data to
 *    the client side, then adds user's name and wss connection to 
 *    related arrays.
 * 3. Information that a user has entered a room is sent to all 
 *    connections
 * 4. If the name is already in use, a message about that is sent to
 *    the client side
 * @param {*} serverData 
 * @param {*} wss 
 * @param {*} data 
 */

const newUser = function (serverData, wss, data) {

  const { rooms, activeUsers } = serverData;
  const { username, room } = data;
  if (!Object.keys(activeUsers).includes(username)) {
    activeUsers[username] = wss;
    wss.send(JSON.stringify({
      type: 'init',
      data: { username, roomsData: rooms }
    }));
    rooms[room].users.push(username);
    Object.values(activeUsers).map(wss => wss.send(JSON.stringify(
      {
        type: 'newUser',
        data: { newUserRoom: room, newUserName: username }
      }
      )));
    } else {
    wss.send(JSON.stringify({
      type: 'userExist'
    }));
  };
};

module.exports = newUser;