const Dictionary = require("../models/Dictionary");
const Language = require("../models/Language");
const { cr } = require('../utils/common');
const { PAGE_SIZE } = require("../utils/constants");

const addWordWithTranslations = async (req, res) => {
    const { word, translations } = req.body;

    if (!word || !translations) {
        return res.status(400).json({ ...cr.missing, message: 'Missing word or translations' });
    }

    try {
        // Check if the word already exists
        const existingEntry = await Dictionary.findOne({ word });
        if (existingEntry) {
            return res.status(409).json({ ...cr.duplicated, message: 'Word already exists' });
        }

        // Validate translations
        const validatedTranslations = [];
        for (const translation of translations) {
            const { languageId, translationText } = translation;

            if (!languageId || !translationText) {
                return res.status(400).json({ ...cr.invalid, message: 'Invalid translation data' });
            }

            // Check if the language exists
            const language = await Language.findById(languageId);
            if (!language) {
                return res.status(404).json({ ...cr.notfound, message: `Language with ID ${languageId} not found` });
            }

            validatedTranslations.push({ language: languageId, translation: translationText });
        }

        // Create a new dictionary entry
        const newEntry = new Dictionary({
            word,
            translations: validatedTranslations,
        });

        await newEntry.save();
        return res.json({ ...cr.ok, message: 'Word added successfully with translations.' });
    } catch (error) {
        console.error('Error adding word with translations:', error);
        return res.status(500).json({ message: 'An error occurred while adding the word with translations.' });
    }
};

const getAllWords = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number from query parameters, default is 1
    const skip = (page - 1) * PAGE_SIZE; // Calculate the number of documents to skip

    try {
        const words = await Dictionary.aggregate([
            { $skip: skip },
            { $limit: PAGE_SIZE },
            {
                $lookup: {
                    from: 'languages',
                    localField: 'translations.language',
                    foreignField: '_id',
                    as: 'languageDetails'
                }
            },
            {
                $unwind: '$translations'
            },
            {
                $lookup: {
                    from: 'languages',
                    localField: 'translations.language',
                    foreignField: '_id',
                    as: 'languageDetail'
                }
            },
            {
                $unwind: {
                    path: '$languageDetail',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    word: { $first: '$word' },
                    translations: {
                        $push: {
                            _id: '$translations._id',
                            imgFlag: '$languageDetail.flag.url',
                            name: '$languageDetail.name',
                            translation: '$translations.translation'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    word: 1,
                    translations: 1
                }
            }
        ]);


        return res.json({ ...cr.ok, words });
    } catch (error) {
        console.error('Error retrieving words:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving words.' });
    }
};

const updateWordWithTranslations = async (req, res) => {
    const { wordId } = req.params
    const { word, translations } = req.body;

    if (!wordId || !word || !translations || !Array.isArray(translations)) {
        return res.status(400).json({ ...cr.missing, message: 'Missing word ID, word, or translations' });
    }

    try {
        // Find the existing dictionary entry by ID
        const existingEntry = await Dictionary.findById(wordId);
        if (!existingEntry) {
            return res.status(404).json({ ...cr.notfound, message: 'Word not found' });
        }

        // Validate translations
        const validatedTranslations = [];
        for (const translation of translations) {
            const { languageId, translationText } = translation;

            if (!languageId || !translationText) {
                return res.status(400).json({ ...cr.invalid, message: 'Invalid translation data' });
            }

            // Check if the language exists
            const language = await Language.findById(languageId);
            if (!language) {
                return res.status(404).json({ ...cr.notfound, message: `Language with ID ${languageId} not found` });
            }

            validatedTranslations.push({
                language: languageId,
                translation: translationText
            });
        }

        // Update the dictionary entry
        existingEntry.word = word;
        existingEntry.translations = validatedTranslations;

        await existingEntry.save();
        return res.json({ ...cr.ok, message: 'Word updated successfully with translations.' });
    } catch (error) {
        console.error('Error updating word with translations:', error);
        return res.status(500).json({ message: 'An error occurred while updating the word with translations.' });
    }
};

const deleteWord = async (req, res) => {
    const { wordId } = req.params;

    if (!wordId) {
        return res.status(400).json({ ...cr.missing, message: 'Missing word ID' });
    }

    try {
        // Find the dictionary entry by ID and remove it
        const deletedEntry = await Dictionary.findByIdAndDelete(wordId);

        if (!deletedEntry) {
            return res.status(404).json({ ...cr.notfound, message: 'Word not found' });
        }

        return res.json({ ...cr.ok, message: 'Word deleted successfully' });
    } catch (error) {
        console.error('Error deleting word:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the word.' });
    }
};



module.exports = {
    addWordWithTranslations, getAllWords, updateWordWithTranslations, deleteWord
}