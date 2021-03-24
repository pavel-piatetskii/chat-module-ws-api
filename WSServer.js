'use strict'
const WebSocket = require('ws');
const { newUser, newMessage, userSwitch } = require('./wssHandlers');

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
        newMessage(serverData, data);
        break;

      case 'userSwitch':
      userSwitch(serverData, data);
    }
  })
})

console.log("*** SERVER STARTED");
