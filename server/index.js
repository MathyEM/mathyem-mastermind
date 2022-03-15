require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 3001
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/db')
const session = require('express-session')
const passport = require('passport')
const User = require('./models/user')
User.syncIndexes()
const { Room } = require('./models/room')
const RememberMeToken = require('./models/rememberMeToken')
const roomController = require('./controllers/roomController')
const LocalStrategy = require('passport-local').Strategy
const RememberMeStrategy = require('passport-remember-me').Strategy
const { socketConnection } = require('./utils/socket.io')

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 365 * 24 * 60 * 60 * 1000,
})

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

app.use(sessionMiddleware)
socketConnection.setupSocketConnection(io, sessionMiddleware, true)


//Initialize passport
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('remember-me'))

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())

// REMEMBER ME
async function consumeRememberMeToken(token, fn) {
  const rememberMeToken = await RememberMeToken.findById(token)
  const uid = rememberMeToken.user.id

  // invalidate the single-use token
  await RememberMeToken.deleteOne({_id: token})
  return fn(null, uid);
}

async function saveRememberMeToken(uid, fn) {
  const newToken = new RememberMeToken()
  newToken.user = uid
  await newToken.save()
  return fn(null, newToken.id);
}

// Remember Me cookie strategy
//   This strategy consumes a remember me token, supplying the user the
//   token was originally issued to.  The token is single-use, so a new
//   token is then issued to replace it.
passport.use(new RememberMeStrategy(
  async function(token, done) {
    consumeRememberMeToken(token, async function(err, uid) {
      if (err) { return done(err) }
      if (!uid) { return done(null, false) }
      
      try {
        const user = await User.findById(uid)
        if (!user) { return done(null, false) }
        return done(null, user)
      } catch (err) {
        if (err) { return done(err) } 
      }
    })
  },
  issueToken
))

function issueToken(user, done) {
  saveRememberMeToken(user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}


//configure database and mongoose
mongoose
.connect(config.database)
.then(() => {
  console.log("Database is connected");
})
.catch(err => {
  console.log({ database_error: err });
})

//Added routes
const loginRouter = require('./routes/login')

// Room.find({owner: '61d8917a7274e857bdb81bac'}).exec((err, rooms) => {
  //   if (err) console.log(err)
  //   console.log(rooms)
  // })
  
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
  