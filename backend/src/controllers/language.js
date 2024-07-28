const cloudinary = require("../cloud")
const Language = require("../models/Language")
const { IncomingForm } = require('formidable');
const { cr } = require("../utils/common");
const { PAGE_SIZE } = require("../utils/constants");
const Dictionary = require("../models/Dictionary");


const addLanguage = async (req, res) => {
    try {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(500).json({ message: 'Error parsing form data' });
            }

            const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            const flag = files.flag ? (Array.isArray(files.flag) ? files.flag[0] : files.flag) : null;

            if (!name) {
                return res.status(400).json({ ...cr.missing, message: 'Language name is required.' });
            }

            // Check if a language with the new name already exists
            const existingLanguageWithName = await Language.findOne({ name });
            if (existingLanguageWithName) {
                return res.status(422).json({ ...cr.duplicated, message: 'A language with this name already exists.' });
            }

            const language = new Language({ name });

            if (flag) {
                try {
                    const imgRes = await cloudinary.uploader.upload(flag.filepath, {
                        width: 300, height: 300,
                        crop: 'thumb', gravity: 'face'
                    });

                    language.flag = { url: imgRes.secure_url, key: imgRes.public_id };
                } catch (err) {
                    console.error('Error uploading poster to Cloudinary:', err);
                    return res.status(500).json({ message: 'Failed to upload poster image.' });
                }
            }

            await language.save();

            return res.json({ ...cr.ok, language });
        });
    } catch (e) {
        console.error(e);
        if (e.name === 'MongoServerError' && e.code === 11000) {
            // Handle duplicate key error
            return res.status(422).json({ message: 'Language name must be unique.' });
        } else {
            // Handle other errors
            return res.status(500).json({ message: 'An error occurred while adding the language.' });
        }
    }
};


const updateLanguage = async (req, res) => {
    try {
        const form = new IncomingForm()
        const { languageId } = req.params;
        const { name } = req.body;

        // Check if a language with the new name already exists
        const existingLanguageWithName = await Language.findOne({ name });
        if (existingLanguageWithName && existingLanguageWithName._id.toString() !== languageId) {
            return res.status(422).json({ ...cr.duplicated, message: 'Language name must be unique.' });
        }
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(500).json({ message: 'Error parsing form data' });
            }


            const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;

            if (!name) {
                return res.status(400).json({ ...cr.missing, message: 'Language name is required.' });
            }

            const existingLanguage = await Language.findOne({ name });
            if (existingLanguage && existingLanguage.name !== name) {
                return res.status(422).json({ message: 'A language with this name already exists' });
            }

            const language = await Language.findByIdAndUpdate(
                languageId,
                {
                    name
                },
                { new: true, runValidators: true }
            );

            if (!language) {
                return res.status(404).json({ message: 'Language not found' });
            }

            const posterImg = files.flag && (Array.isArray(files.flag) ? files.flag[0] : files.flag);
            if (posterImg) {
                if (language.flag?.key) {
                    try {
                        await cloudinary.uploader.destroy(language.flag.key);
                    } catch (err) {
                        console.error('Error deleting poster from Cloudinary:', err);
                    }
                }

                try {
                    const imgRes = await cloudinary.uploader.upload(posterImg.filepath, {
                        width: 300, height: 300,
                        crop: 'thumb', gravity: 'face'
                    });

                    language.flag = { url: imgRes.secure_url, key: imgRes.public_id };
                    await language.save();
                } catch (err) {
                    console.error('Error uploading new poster to Cloudinary:', err);
                    return res.status(500).json({ message: 'Failed to upload new poster image.' });
                }
            }

            return res.json({ ...cr.ok });
        });
    } catch (e) {
        if (e.name === 'MongoServerError' && e.code === 11000) {
            // Handle duplicate key error
            return res.status(422).json({ message: 'Language name must be unique.' });
        } else {
            // Handle other errors
            console.error(e);
            return res.status(500).json({ message: 'An error occurred while updating the language.' });
        }
    }
};


const getAllLanguagesPagination = async (req, res) => {
    try {
        // Get the page and limit from the query parameters, defaulting to page 1 and limit 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || PAGE_SIZE;

        // Calculate the number of items to skip
        const skip = (page - 1) * limit;

        // Fetch the total count of languages
        const totalLanguages = await Language.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalLanguages / limit);

        // Fetch the languages with pagination
        const languages = await Language.find().skip(skip).limit(limit);

        // Return the response with languages, totalPages, and currentPage
        return res.json({
            ...cr.ok,
            data: languages,
            totalPages,
            page
        });
    } catch (error) {
        console.error('Error fetching languages:', error);
        return res.status(500).json({ ...cr.error, message: 'Internal Server Error' });
    }
};


const getAllLanguages = async (req, res) => {
    try {
        const languages = await Language.find()

        // Return the response with languages, totalPages, and currentPage
        return res.json({
            ...cr.ok,
            languages
        });
    } catch (error) {
        console.error('Error fetching languages:', error);
        return res.status(500).json({ ...cr.error, message: 'Internal Server Error' });
    }
};
const getSpecificLanguage = async (req, res) => {
    const { languageId } = req.params
    try {
        const language = await Language.findById(languageId)
        console.log('check langaugeas id', languageId);
        if (!language) return res.status(404).json({ ...cr.notfound, message: 'Language not found' })
        return res.json({
            ...cr.ok,
            language
        });
    } catch (error) {
        console.error('Error fetching lagnuage:', error);
        return res.status(500).json({ ...cr.error, message: 'Internal Server Error' });
    }
};

const deleteLanguage = async (req, res) => {
    const { languageId } = req.params;

    if (!languageId) {
        return res.status(400).json({ ...cr.missing, message: 'Missing language ID' });
    }

    try {
        // Find the language by ID and remove it
        const deletedLanguage = await Language.findByIdAndDelete(languageId);

        if (!deletedLanguage) {
            return res.status(404).json({ ...cr.notfound, message: 'Language not found' });
        }

        // Find and remove dictionary entries with translations referencing the deleted language
        await Dictionary.deleteMany({ 'translations.language': languageId });

        return res.json({ ...cr.ok, message: 'Language and related dictionary entries deleted successfully' });
    } catch (error) {
        console.error('Error deleting language and related dictionary entries:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the language and related dictionary entries.' });
    }
};


module.exports = {
    addLanguage, getAllLanguagesPagination, updateLanguage, getAllLanguages, getSpecificLanguage, deleteLanguage
}