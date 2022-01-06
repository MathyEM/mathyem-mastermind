const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const { socketConnection } = require('./utils/socket.io')
socketConnection(http)

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Setup CORS
app.use(cors({
  origin: 'http://localhost:7070'
}))

//Added routes
const loginRouter = require('./routes/login')

app.use('/', loginRouter)

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
});

//Start server
http.listen(3001, () => {
  console.log('listening on *:3001')
});