const mongoAddress = process.env.MONGO_ADDRESS
const mongoSecret = process.env.MONGO_SECRET
const dbName = process.env.DB_NAME

module.exports = {
    database: `${mongoAddress}/${dbName}`,//"mongodb://localhost:27017/mathyem-mastermind",
    secret: mongoSecret
};