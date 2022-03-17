require('dotenv').config()
const express = require('express'),
      cors = require('cors'),
      app = express(),
      http = require('http').createServer(app),
      bodyParser = require('body-parser'),
      config = require('./config/db'),
      passport = require('passport'),
      session = require('express-session'),
      cookieParse = require('cookie-parser'),
      mongoose = require('mongoose'),
      User = require('./models/user'),
      { Room } = require('./models/room'),
      MongoStore = require('connect-mongo'),
      roomController = require('./controllers/roomController'),
      LocalStrategy = require('passport-local').Strategy,
      { socketConnection } = require('./utils/socket.io'),
      PORT = process.env.PORT || 3001

//configure database and mongoose
const clientP = mongoose.connect(
  config.database,
).then((m) => {
  console.log("Database is connected")
  return m.connection.getClient()
})
.catch(err => {
  console.log({ database_error: err })
})

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  httpOnly: false,
  store: MongoStore.create({
    clientPromise: clientP,
    dbName: process.env.DB_NAME,
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1,
  }),
})
//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Setup CORS
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST'],
  origin: ['http://localhost:7070', 'http://192.168.87.196:7070', 'http://178.155.207.111:7070', 'https://mem-home.tk', 'https://mastermind.mem-home.tk']
}))

io = require('socket.io')(http, {
  cors: {
    credentials: true,
    methods: ['GET', 'POST'],
    origin: ['http://localhost:7070', 'http://192.168.87.196:7070', 'http://178.155.207.111:7070', 'https://mem-home.tk', 'https://mastermind.mem-home.tk']
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

//Start server
http.listen(3001, () => {
  console.log(`listening on *${PORT}`)
})
  