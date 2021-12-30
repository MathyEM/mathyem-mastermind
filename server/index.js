const { scoketConnection, socketConnection } = require('./utils/socket.io')
const app = require('express')();
const http = require('http').createServer(app);
socketConnection(http);


app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
});

http.listen(3001, () => {
  console.log('listening on *:3001')
});