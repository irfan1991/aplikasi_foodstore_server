const router = require('express').Router()
const multer = require('multer')
const invoiceController = require('./controller')


router.get('/invoice/:order_id',multer().none(), invoiceController.index)


module.exports = router

