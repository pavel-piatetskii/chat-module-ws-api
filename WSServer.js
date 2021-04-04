'use strict'
const WebSocket = require('ws');

/** Uncomment for WS Secure
 const fs = require('fs');
 const https = require('https')
 const server = new https.createServer({
   cert: fs.readFileSync(process.env.CERT),
   key: fs.readFileSync(process.env.PKEY),
 });
 const wss = new WebSocket.Server({ server });
 */


// Import ws connection handlers
const { newUser, newMessage, userSwitch, closeConnection, returningUser } = require('./wsHandlers');

// Import the object which contains names, room and connections data
const serverData = require('./serverData');

// Start WS server on the port 3001 ('npm run dev') or 80 (by default)
const PORT = process.env.PORT || 80;

// Create WS Server. Comment out for WS Secure
const wss = new WebSocket.Server({ port: PORT });

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

//Uncomment for WS Secure
//server.listen(PORT);
console.log("*** SERVER STARTED on port " + PORT);