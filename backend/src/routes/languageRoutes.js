const { Router } = require('express')
const { addLanguage, updateLanguage, getAllLanguagesPagination, getAllLanguages, getSpecificLanguage, deleteLanguage } = require('../controllers/language')
const router = Router()

router.post('/', addLanguage)
router.patch('/:languageId', updateLanguage)
router.delete('/:languageId', deleteLanguage)
router.get('/', getAllLanguagesPagination)
router.get('/all', getAllLanguages)
router.get('/specific/:languageId', getSpecificLanguage)


module.exports = router