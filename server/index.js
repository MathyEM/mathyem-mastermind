const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:7070']
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  // CREATE ROOM
  socket.on('create-room', (data) => {
    console.log(data);
  })

  // JOIN ROOM
  socket.on('join-room', (data) => {
    console.log(data);
  })

  // ON DISCONNECT
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});