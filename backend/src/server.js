require('dotenv').config()
const express = require('express');
require('./db/index.js')
const dictionaryRoutes = require('./routes/dictionaryRoutes.js')
const languageRoutes = require('./routes/languageRoutes.js')


const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/dictionary', dictionaryRoutes);
app.use('/language', languageRoutes);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});