const mongoose = require('mongoose')
const Order = require('./model')
const OrderItem = require('../order-item/model')
const CartItem = require('../cart-item/model')
const DeveryAddress = require('../delivery-addresses/model')
const { policyFor } = require('../policy')
const { subject } = require('@casl/ability')

async function store(req, res, next) {
    // mendapatkan policy utuk user yang login
    let policy = policyFor(req.user);

    // cek apaakah policy mengizinkan ordr
    if (!policy.can('create', 'Order')) {
        return res.json({
            error : 1 ,
            message : 'You are not allowed this action'
        })
    }

    try {

        let {delivery_fee, delivery_address} = req.body;
        
        // dapatin item keranjang
        let items = await CartItem.find({user :  req.user._id}).populate('product');
          

        // cek apakah keranjang kosong gak
        if (!items.length) {
            return res.json({
                error : 1,
                message : 'can not create order because you have no items in cart'
            });
        }

        // mencari adrees 
        let address = await DeveryAddress.findOne({_id: delivery_address});

        // createa order
        let order = new Order({
            _id : new mongoose.Types.ObjectId(),
            status : 'waiting_payment',
            delivery_fee,
            delivery_address : {
                provinsi : address.provinsi,
                kabupaten : address.kabupaten,
                kecamatan : address.kecamatan,
                kelurahan : address.kelurahan,
                detail : address.detail
            },

            user :  req.user._id
        });

  
        
        let orderItems = await OrderItem
            .insertMany(
                items.map( item => 
                   
                    ({
                    ...item,
                    name : item.product.name,
                    qty : parseInt(item.qty),
                    price : parseInt(item.product.price),
                    order: order._id,
                    product : item.product._id
                }))
            );

            console.log(orderItems);       
            
        // loop orderitem
        orderItems.forEach(item => { 
         order.order_items.push(item)});

        //saving oder
        await order.save();

        //delete items dalam keranjang
        await CartItem.deleteMany({user : req.user._id});

        return res.json(order);

    } catch (error) {
        
        if (error && error.name === "ValidationError") {
            
            return res.json({
                error : 1,
                message : error.message,
                fields : error.errors
            })
        }
       //  console.log(error);
         
        next(error)
    }
}

async function index(req, res, next) {
    
    let policy = policyFor(req.user);

    if (!policy.can('view', 'Order')) {
        return res.json({
            error : 1,
            message : 'You are not allowed to perform this action'
        })
    }

    try {

        // daptin query string limit sama skip
        let {limit = 10 , skip = 0} = req.query;

        //menghitung jumlah order user login tapa pagination 
        let count = await Order.find({user : req.user._id}).countDocuments();

        // data order
        let orders = await Order
            .find({user : req.user._id})
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('order_items')
            .sort('-createdAt');
        
        return res.json({
            data : orders.map(order => order.toJSON({virtuals: true})),
            count
        })

    } catch (error) {
        

        if (error && error.name === "ValidationError") {
            
            return res.json({
                error : 1,
                message : error.message,
                fields : error.errors
            })
        }

        next(error)
    }
}

module.exports = {
    store,
    index
}