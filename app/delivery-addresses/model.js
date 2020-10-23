const mongoose = require('mongoose')

const {model, Schema} = mongoose;

const deliveyAddressesSchema = Schema({

    nama : {
        type : String,
        required : [true, 'Nama alamat harus diisi'],
        maxLength : [255, 'Panjang alamat karakter maximal 255 karakter']
    },
    kelurahan : {
        type : String,
        required : [true, 'Nama kelurahan harus diisi'],
        maxLength : [255, 'Panjang kelurahan karakter maximal 255 karakter']
    },
    kecamatan : {
        type : String,
        required : [true, 'Nama kecamatan harus diisi'],
        maxLength : [255, 'Panjang kecamatan karakter maximal 255 karakter']
    },
    kabupaten : {
        type : String,
        required : [true, 'Nama kabupaten harus diisi'],
        maxLength : [255, 'Panjang kabupaten karakter maximal 255 karakter']
    },

    provinsi: {
        type : String,
        required : [true, 'Nama provinsi harus diisi'],
        maxLength : [255, 'Panjang provinsi karakter maximal 255 karakter']
    },
    detail : {
        type : String,
        required : [true, 'Detail alamat harus diisi'],
        maxLength : [1000, 'Panjang  detail alamat karakter maximal 1000 karakter']
    },

    user : {
        type : Schema.Types.ObjectId,
       ref : 'User'
    },

}, {timestamps : true});

module.exports = model('DeliveryAddresses', deliveyAddressesSchema);