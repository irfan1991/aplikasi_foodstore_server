const mongoose = require('mongoose')
const {model, Schema} = mongoose

let tagSchema = Schema({
    name : {
        type: String,
        minlength : [3, 'Panjang nama kategori minimal 3 karakter'],
        maxlength : [20, 'Panjang nama kategori maximal 20 karaakter'],
        required : [true, 'Nama kategori harus diisi']
    }
}, {timestamps : true})

module.exports = model('Tag', tagSchema)