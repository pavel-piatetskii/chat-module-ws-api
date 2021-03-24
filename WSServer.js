'use strict'
const WebSocket = require('ws');

const PORT = process.env.PORT || 80;
//const PORT = 3001;
//console.log(process.env.PORT)

const server = new WebSocket.Server({ port: PORT })
let namelist = [];

const rooms = {
  '1': {
    id: '1',
    name: 'Main Room',
    image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/greece.png',
    history: [],
    users: ['user in main'],
  },
  '2': {
    id: 2,
    name: 'Offtopic',
    image: 'http://forums.civfanatics.com/images/war_academy/civ5/civs/big/aztec.png',
    history: [],
    users: ['user in offtop'],
  },
};

const connections = [];

//const sendToAll = function(data) {
//  
//}

server.on('connection', wss => {
  console.log(`New connection`)

  wss.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    const { room } = data;
    process.stdout.write(type +': ');
    console.log(data)
    switch (type) {

      case 'newUser':
        const { username } = data;
        if (!namelist.includes(username)) {
          namelist.push(username);
          rooms[room].users.push(username);
          wss.send(JSON.stringify({
            type: 'init',
            data: { username, roomsData: rooms }
          }));
          connections.map(wss => wss.send(JSON.stringify(
            {
              type: 'newUser',
              data: { newUserRoom: room, newUserName: username }
            }
          )));
          connections.push(wss);
          console.log(connections.length)
        } else {
          wss.send(JSON.stringify({
            type: 'userExist'
          }));
        };
        //connections.map(ws => wss.send(JSON.stringify({ type: 'users', data: users })));
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
      //default:
      //  connections.map(ws => wss.send(JSON.stringify({ type: 'users', data: users })));
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
