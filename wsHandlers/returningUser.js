/**
 * Handler for existing user trying to return to the chat
 * @param {*} serverData 
 * @param {*} wss 
 * @param {*} data 
 */

 const returningUser = function (serverData, wss, data) {

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
      type: 'sessionExpired'
    }));
  };
};

module.exports = returningUser;