'use strict'
const WebSocket = require('ws');

// Import wss connection handlers
const { newUser, newMessage, userSwitch, closeConnection } = require('./wssHandlers');

// Import the object which contains names, room and connections data
const serverData = require('./serverData');

// Start WS server on the port 3001 ('npm run development') or 80 (by default)
const PORT = process.env.PORT || 80;
const server = new WebSocket.Server({ port: PORT });

/**
 * Main switch between WS connection handlers.
 * Each handler is put to a separate file and is triggered by the
 * 'type' field each service message sent by the client side has
 */
server.on('connection', wss => {
  console.log(`New connection`);

  wss.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    process.stdout.write(type +': ');
    console.log(data);
    
    switch (type) {

      case 'newUser':
        newUser(serverData, wss, data, server);
        break;

      case 'newMessage':
        newMessage(serverData, data, server);
        break;

      case 'userSwitch':
      userSwitch(serverData, data, server);
      break;

      case 'close':
        closeConnection(serverData, data, server);
    }
  })
})

console.log("*** SERVER STARTED");
