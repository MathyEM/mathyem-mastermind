const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:7070']
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
});

io.on('connection', (socket) => {
  const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  console.log('a user connected: ' + socket.id)

  // CREATE ROOM
  socket.on('create-room', (data, callback) => {
    const id = uid()
    console.log('Room created: ', data.roomName, id)
    socket.join(id)
    
    callback({
      status: 'ok',
      roomName: data.roomName,
      id: id,
    })
  })

  // JOIN ROOM
  socket.on('join-room', (data, callback) => {
    console.log('Room joined: ', data.roomId)
    socket.join(data.roomId)
    
    io.in(data.roomId).emit('room-status', 'A new user joined the room')

    callback({
      status: 'ok',
      roomId: data.roomId,
    })
  })

  // ON DISCONNECT
  socket.on('disconnect', () => {
    console.log('user disconnected')
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001')
});