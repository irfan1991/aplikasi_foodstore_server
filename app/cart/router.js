const router = require('express').Router()
const multer = require('multer')
const cartController = require('./controller')

router.put('/carts/:id',multer().none(), cartController.update)
router.get('/carts',multer().none(), cartController.index)


module.exports = router
