const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    flag: {
        url: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
        },
    },
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;