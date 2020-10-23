const router = require('express').Router()
const multer = require('multer')
const categoryController = require('./controller')

router.post('/categories',multer().none(), categoryController.store)
router.put('/categories/:id',multer().none(), categoryController.update)
router.get('/categories',multer().none(), categoryController.index)
router.delete('/categories/:id', multer().none(), categoryController.destroy)

module.exports = router

