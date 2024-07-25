require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI
const URI = MONGO_URI

mongoose.set('strictQuery', true)
mongoose.connect(URI)
    .then(() => {
        console.log('db is connected')
    }).catch((e) => {
        console.log('db connection failed', e)
    })