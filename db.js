const {MongoClient} = require('mongodb')
require('dotenv').config()

let dbConnection

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}cluster0.1xluh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then(client => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },

    getDb: () => dbConnection
}