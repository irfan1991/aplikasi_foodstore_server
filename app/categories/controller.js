const Category = require('./model')
const { policyFor } = require('../policy')

async function store(req, res, next) {
    
    try {
        
        let policy = policyFor(req.user)

        if (!policy.can('create', 'Category')) {
            return res.json({
                error : 1,
                message : 'Anda tidak memiliki akses untuk membuat category'
            })
        }

        let payload = req.body;
        let category = new Category(payload)
        await category.save()
        return res.json(category)

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

async function index(req, res, next) {

    
    try {
        
        let {limit = 10 , skip = 0 } = req.query;

        let categories = await Category.find().limit(parseInt(limit)).skip(parseInt(skip));
        return res.json(categories);

    } catch (error) {
        next(error)
    }
    
}

async function update(req, res, next) {

     
    try {
        
        let policy = policyFor(req.user)

        if (!policy.can('update', 'Category')) {
            return res.json({
                error : 1,
                message : 'Anda tidak memiliki akses untuk mengupdate category'
            })
        }

        let payload = req.body;
        let category = await Category.findOneAndUpdate({_id : req.params.id},payload,{new:true, runValidators:true})
        return res.json(category)

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

async function destroy(req, res, next) {

     
    try {

        let policy = policyFor(req.user)

        if (!policy.can('delete', 'Category')) {
            return res.json({
                error : 1,
                message : 'Anda tidak memiliki akses untuk menghapus category'
            })
        }

        let deleted = await Category.findOneAndDelete({_id:req.params.id})
        return res.json(deleted)

    } catch (error) {
        next(error)
    }
    
}

module.exports ={
    index,
    store,
    update,
    destroy
}