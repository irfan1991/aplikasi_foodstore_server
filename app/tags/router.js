const router = require('express').Router()
const multer = require('multer')
const tagController = require('./controller')

router.post('/tag',multer().none(), tagController.store)
router.put('/tag/:id',multer().none(), tagController.update)
router.get('/tag',multer().none(), tagController.index)
router.delete('/tag/:id', multer().none(), tagController.destroy)

module.exports = router

