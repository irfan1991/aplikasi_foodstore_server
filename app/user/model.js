const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {model, Schema} = mongoose

const HASH_ROUND = 10;

let userSchema = Schema({
    full_name : {
        type : String,
        required :[true,'Nama harus diisi'],
        maxlength : [255, 'Panjang nama harus 3 - 255 karakter'],
        minlength : [3, 'Panjang nama harus 3 - 255 karakter'],
    },
    customer_id : {
        type : Number
    },
    email : {
        type : String,
        required :[true,'Email harus diisi'],
        maxlength : [255, 'Panjang email maximal 255 karakter'],
    },
    password : {
        type : String,
        required :[true,'Password harus diisi'],
        maxlength : [255, 'Panjang password maximal 255 karakter'],
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    },
    token : {
        type : String
    },
}, {timestamps : true})

userSchema.path('email').validate(function (value) {
    // email reguler expression
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    // jika true email berhasil divalidasi
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid !!`);

userSchema.path('email').validate( async function (value) {
   
    try {
        
        // cari ke collection
        const count = await this.model('User').count({email: value})

        return !count;

    } catch (error) {
        throw error;
    }
}, attr => `${attr.value}sudah terdaftar !!`);

userSchema.pre('save', function(next) {
    const salt = bcrypt.genSaltSync(HASH_ROUND)
    this.password = bcrypt.hashSync(this.password, salt);
    next()
})

userSchema.plugin(AutoIncrement, {inc_field  :'customer_id'})

module.exports = model('User', userSchema)