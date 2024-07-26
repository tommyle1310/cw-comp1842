require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
require('./db/index.js');
const dictionaryRoutes = require('./routes/dictionaryRoutes.js');
const languageRoutes = require('./routes/languageRoutes.js');

const port = process.env.PORT || 3000; // Provide a default port if not specified
const app = express();

app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from localhost:3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/dictionary', dictionaryRoutes);
app.use('/language', languageRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
