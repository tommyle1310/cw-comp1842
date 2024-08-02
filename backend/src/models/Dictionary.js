const mongoose = require('mongoose');
const Language = require('./Language'); // Adjust the path as needed

const translationSchema = new mongoose.Schema({
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true,
    },
    translation: {
        type: String,
        required: true,
    },
});

const dictionarySchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
    },
    translations: [translationSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);

module.exports = Dictionary;
