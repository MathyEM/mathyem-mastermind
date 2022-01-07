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
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { socketConnection } = require('./utils/socket.io')
socketConnection(http)

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

//Setup CORS
app.use(cors({
  credentials: true,
  origin: 'http://localhost:7070'
}))

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
  });

//Added routes
const loginRouter = require('./routes/login')

app.use('/', loginRouter)

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
});

//Start server
http.listen(3001, () => {
  console.log(`listening on *${PORT}`)
});