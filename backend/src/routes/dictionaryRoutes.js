const Dictionary = require('../models/Dictionary');
const { Router } = require('express')
const { addWordWithTranslations, getAllWords, updateWordWithTranslations, deleteWord, getSpecificWord } = require('../controllers/dictionary');

const router = Router()

router.post('/', addWordWithTranslations)
router.get('/', getAllWords)
router.get('/:wordId', getSpecificWord)
router.patch('/:wordId', updateWordWithTranslations)
router.delete('/:wordId', deleteWord)



module.exports = router