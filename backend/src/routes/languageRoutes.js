const { Router } = require('express')
const { addLanguage, updateLanguage, getAllLanguages } = require('../controllers/language')
const router = Router()

router.post('/', addLanguage)
router.patch('/:languageId', updateLanguage)
router.get('/', getAllLanguages)


module.exports = router