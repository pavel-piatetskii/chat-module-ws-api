'use strict'
//const http = require('http');
const WebSocket = require('ws');

//const PORT = env.PORT || 80;
const PORT = 3001;
//console.log('*** NAMESERVER CREATED')

//console.log('*** CREATING ROOMS');

const server = new WebSocket.Server({ port: PORT })

const rooms = {
  'namelist': ['testname'],
  '1': {
    //server: new WebSocket.Server({ port: 3001 }),
    //port: 3001,
    connections: [],
    history: [],
    users: [],
  },
  '2': {
    //server: new WebSocket.Server({ port: 3002 }),
    //port: 3002,
    connections: [],
    history: [],
    users: [],
  },
}

server.on('connection', wss => {
  console.log(`New connection on port `)
  //wss.send(JSON.stringify({ type: 'history', data: history }));
  //connections.push(ws);
  wss.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    process.stdout.write(type +': ');
    console.log(data)
    switch (type) {

      case 'newMessage':
        history.push({
          id: history.length,
          sender: data.sender,
          message: data.newMessage,
          time: new Date(),
        });
        connections.map(ws =>
          wss.send(JSON.stringify({ type, data }))
        );
        break;

      case 'newUser':
        const { username,room } = data;
        if (!rooms.namelist.includes(username)) {
          rooms.namelist.push(username);
          rooms[room].users.push(username);
          wss.send(JSON.stringify({
            type: 'init',
            data: {
              username, 
              users: rooms['1'].users,
              history: rooms['1'].history
            }
          }));
        } else {
          wss.send(JSON.stringify({
            type: 'userExist'
          }));
        };
        //connections.map(ws => wss.send(JSON.stringify({ type: 'users', data: users })));
        break;

      case 'userClosed':
        users = users.filter(user => user != data);
        names = names.filter(user => user != data);
      default:
        connections.map(ws => wss.send(JSON.stringify({ type: 'users', data: users })));
    }
  })
})

console.log("*** ALL ROOMS CREATED");

          //const nameserver = new WebSocket.Server({ port: 2999 });
          //let names = [];
          //nameserver.on('connection', ws => {
          //  wss.on('message', message => {
          //    console.log(names)
          //    const { data } = JSON.parse(message);
          //    console.log(data)
          //    const nameExists = names.includes(data);
          //    wss.send(JSON.stringify({ nameExists }));
          //  })
          //});

          //for (const room in rooms) {
          //
          //  const { server, port, connections, history } = rooms[room];
          //  let { users } = rooms[room];
          //
          //  server.on('connection', ws => {
          //    console.log(`New connection on port ${port}`)
          //
          //    wss.send(JSON.stringify({ type: 'history', data: history }));
          //    connections.push(ws);
          //
          //    wss.on('message', (message) => {
          //      const { type, data } = JSON.parse(message);
          //      console.log(`${type}: ${data}`);
          //
          //      switch (type) {
          //        case 'newMessage':
          //          history.push({
          //            id: history.length,
          //            sender: data.sender,
          //            message: data.newMessage,
          //            time: new Date(),
          //          });
          //          connections.map(ws =>
          //            wss.send(JSON.stringify({ type, data }))
          //          );
          //          break;
          //        case 'newUser':
          //          if (!users.includes(data)) {
          //            users.push(data);
          //            names.push(data);
          //          };
          //          connections.map(ws => wss.send(JSON.stringify({ type: 'users', data: users })));
          //          break;
          //        case 'userClosed':
          //          users = users.filter(user => user != data);
          //          names = names.filter(user => user != data);
          //        default:
          //          connections.map(ws => wss.send(JSON.stringify({ type: 'users', data: users })));
          //
          //      }
          //    })
          //  })
          //
          //  //console.log(`*** CREATED ROOM ON PORT ${port}`);
          //
          //}
