'use strict'
const fs = require('fs');
const https = require('https')
const WebSocket = require('ws');

const server = new https.createServer({
  cert: fs.readFileSync(process.env.CERT),
  key: fs.readFileSync(process.env.PKEY.replace(/\\n/gm, '\n')),
  
});

// Import ws connection handlers
const { newUser, newMessage, userSwitch, closeConnection, returningUser } = require('./wsHandlers');

// Import the object which contains names, room and connections data
const serverData = require('./serverData');

// Start WS server on the port 3001 ('npm run development') or 80 (by default)
const PORT = process.env.PORT || 80;
const wss = new WebSocket.Server({ server });

/**
 * Main switch between WS connection handlers.
 * Each handler is put to a separate file and is triggered by the
 * 'type' field each service message sent by the client side has
 */

wss.on('connection', ws => {
  console.log(`New connection`);

  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    process.stdout.write(type +': ');
    console.log(data);
    
    switch (type) {

      case 'newUser':
        newUser(serverData, ws, data);
        break;

      case 'returningUser':
        returningUser(serverData, ws, data);
        break;

      case 'newMessage':
        newMessage(serverData, data);
        break;

      case 'userSwitch':
        userSwitch(serverData, data);
        break;

      case 'close':
        closeConnection(serverData, data);
    }
  })
})

server.listen(PORT);
console.log("*** SERVER STARTED on port " + PORT);