const Product = require('../products/model')
const { policyFor } = require('../policy')
const CartItem = require('../cart-item/model')

async function index(req, res, next) {

     
    let policy = policyFor(req.user)

    if (!policy.can('read', 'Cart')) {
        return res.json({
            error : 1,
            message : 'Anda tidak memiliki akses untuk membaca cart'
        })
    }

    
    try {
       
        // cari items dari mongo berdasarkan user 
        let items = await CartItem
        .find({user : req.user._id})
        .populate('product')

        return res.json(items);

    } catch (error) {
        
        if (error && error.name === 'ValidatorError') {
            return res.json({
                error : 1,
                message : error.message,
                fields : error.errors
            })
        }
        next(error)
    }
    
}

async function update(req, res, next) {

     
    let policy = policyFor(req.user)

    if (!policy.can('update', 'Cart')) {
        return res.json({
            error : 1,
            message : 'Anda tidak memiliki akses untuk mengupdate cart'
        })
    }

     
    try {
       
       let {items } = req.body
       const productIds = items.map(itm => itm._id)
       const products = await Product.find({_id : {$in : productIds}})

       let cartItems = items.map(item => {

        //cari relasi product itu berdasarkan product._id dan items._id
        let relatedProduct = products.find(product => product._id.toString() == item._id);

        // buat object untuk simpat data product sebagai cartitem

        return {
            _id : relatedProduct._id,
            product  : relatedProduct._id,
            price : relatedProduct.price,
            image_url : relatedProduct.image_url,
            name : relatedProduct.name,
            user : req.user._id,
            qty : item.qty
        }

       })

    //    await CartItem.deleteMany({user: req.user._id});
       await CartItem.bulkWrite(cartItems.map(item => {
           return {
               updateOne:{
                   filter : {user : req.user._id , product : item.product}
               },
               update : item,
               upsert : true
           }
       }))
        return res.json(cartItems)

    } catch (error) {
        
        if (error && error.name === 'ValidatorError') {
            return res.json({
                error : 1,
                message : error.message,
                fields : error.errors
            })
        }
        next(error)
    }
    
}


module.exports ={
    index,
    update,
 
}