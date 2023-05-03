require('dotenv').config()
const express = require('express'),
      cors = require('cors'),
      app = express(),
      http = require('http').createServer(app),
      bodyParser = require('body-parser'),
      config = require('./config/db'),
      passport = require('passport'),
      session = require('express-session'),
      mongoose = require('mongoose'),
      User = require('./models/user'),
      { Room } = require('./models/room'),
      MongoStore = require('connect-mongo'),
      mongoStore = require('./models/mongoStore')
      roomController = require('./controllers/roomController'),
      LocalStrategy = require('passport-local').Strategy,
      { socketConnection } = require('./utils/socket.io'),
      webpush = require('web-push'),
      path = require('path'),
      PORT = process.env.PORT || 3001


const sessionMiddleware = session({
  name: 'session_id',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  httpOnly: false,
  cookie: {
    httpOnly: false,
  },
  store: mongoStore,
})
//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Setup CORS
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST'],
  origin: ['http://localhost:7070', 'http://192.168.87.133:7070', 'http://192.168.87.101:7070', 'https://mem-home.dk', 'https://mastermind.mem-home.dk']
}))

io = require('socket.io')(http, {
  cors: {
    credentials: true,
    methods: ['GET', 'POST'],
    origin: ['http://localhost:7070', 'http://192.168.87.133:7070', 'http://192.168.87.101:7070', 'https://mem-home.dk', 'https://mastermind.mem-home.dk']
  }
})

//Use session
app.use(sessionMiddleware)
socketConnection.setupSocketConnection(io, sessionMiddleware, true)

//Initialize passport
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Added routes
const loginRouter = require('./routes/login')
app.use('/', loginRouter)
app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
})

async function deleteUsers() {
  const needsDeleted = await User.find({ username: { $nin: ['Mathyvids', 'Mathy'] } }).exec()

  console.log(needsDeleted)
}

async function updateUser() {
  const needsUpdated = await User.find({ username: 'Mathyvids' }).exec()
  // needsUpdated[0].email = 'test2@test.com'
  // needsUpdated[0].save()
  console.log(needsUpdated)
}

// DELETE ALL USERS EXCEPT TEST USERS
// deleteUsers()
// updateUser()

// roomController.deleteRooms()

// roomController.resetRoom('62191e17e1c78be54edb0c43')

// roomController.completeRound('61d8917a7274e857bdb81bac','621ba322c8ab8cf3ce58c65c', 0)

// PUSH NOTIFICATIONS/ WEB PUSH
const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

webpush.setVapidDetails('mailto:dj-ert@hotmail.com', publicVapidKey, privateVapidKey)

// Subscribe Route
const subscribeRouter = require('./routes/subscribe')

app.use('/', subscribeRouter)


//Start server
http.listen(3001, () => {
  console.log(`listening on *${PORT}`)
})

module.exports = { mongoStore }
  