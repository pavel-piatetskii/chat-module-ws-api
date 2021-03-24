const closeConnection = function(serverData, wss, server) {
  const { rooms, namelist, connections } = serverData;;
  wss.close();
  
}

module.exports = closeConnection;