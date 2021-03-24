'use strict'
const WebSocket = require('ws');
const { newUser } = require('./wssHandlers/newUser');

const PORT = process.env.PORT || 80;
const server = new WebSocket.Server({ port: PORT });

const serverData = {
  rooms: {
    '1': {
      id: '1',
      name: 'Main Room',
      image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/greece.png',
      history: [],
      users: [],
    },
    '2': {
      id: 2,
      name: 'Offtopic',
      image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/aztec.png',
      history: [],
      users: [],
    },
  },
  connections: [],
  namelist: [],
}


server.on('connection', wss => {
  console.log(`New connection`)

  wss.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    process.stdout.write(type +': ');
    console.log(data);
    
    switch (type) {

      case 'newUser':
        newUser(serverData, wss, data);
        break;

      case 'newMessage':
        const { sender, newMessage } = data;
        const messageToSave = {
          id: rooms[room].history.length,
          sender,
          message: newMessage,
          time: new Date(),
        };
        rooms[room].history.push(messageToSave);
        connections.map(wss =>
          wss.send(JSON.stringify({ type, data: { messageToSave, room } }))
        );
        break;

      case 'userSwitch':
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
    }
  })
})

console.log("*** SERVER STARTED");
