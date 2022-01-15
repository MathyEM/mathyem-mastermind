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
const { Room } = require('./models/room')
const LocalStrategy = require('passport-local').Strategy
const { socketConnection } = require('./utils/socket.io')

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
})

//Setup CORS
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST'],
  origin: ['http://localhost:7070', 'http://192.168.87.196:7070']
}))

io = require('socket.io')(http, {
  cors: {
    credentials: true,
    methods: ['GET', 'POST'],
    origin: ['http://localhost:7070', 'http://192.168.87.196:7070']
  }
})

app.use(sessionMiddleware)
socketConnection.setupSocketConnection(io, sessionMiddleware, true)


//Initialize passport
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())


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

//Start server
http.listen(3001, () => {
  console.log(`listening on *${PORT}`)
})
