const Dictionary = require('../models/Dictionary');
const { Router } = require('express')
const { addWordWithTranslations, getAllWords, updateWordWithTranslations, deleteWord } = require('../controllers/dictionary');

const router = Router()

router.post('/', addWordWithTranslations)
router.get('/', getAllWords)
router.patch('/:wordId', updateWordWithTranslations)
router.delete('/:wordId', deleteWord)



module.exports = router