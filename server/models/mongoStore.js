const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const config = require('../config/db')

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

const mongoStore = MongoStore.create({
  clientPromise: clientP,
  dbName: process.env.DB_NAME,
  stringify: false,
  autoRemove: 'interval',
  autoRemoveInterval: 1,
})

module.exports = mongoStore