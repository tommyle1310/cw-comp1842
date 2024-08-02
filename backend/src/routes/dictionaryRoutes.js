const { Router } = require('express')
const { addWordWithTranslations, getAllWords, updateWordWithTranslations, deleteWord, getSpecificWord, getAllWordsPagination } = require('../controllers/dictionary');

const router = Router()

router.post('/', addWordWithTranslations)
router.get('/all', getAllWords)
router.get('/', getAllWordsPagination)
router.get('/:wordId', getSpecificWord)
router.patch('/:wordId', updateWordWithTranslations)
router.delete('/:wordId', deleteWord)



module.exports = router