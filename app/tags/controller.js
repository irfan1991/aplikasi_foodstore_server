const Tag = require('./model')


async function store(req, res, next) {
    
    try {
        
        let payload = req.body;
        let tag = new Tag(payload)
        await tag.save()
        return res.json(tag)

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

        let categories = await Tag.find().limit(parseInt(limit)).skip(parseInt(skip));
        return res.json(categories);

    } catch (error) {
        next(error)
    }
    
}

async function update(req, res, next) {

     
    try {
        
        let payload = req.body;
        let tag = await Tag.findOneAndUpdate({_id : req.params.id},payload,{new:true, runValidators:true})
        return res.json(tag)

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

        let deleted = await Tag.findOneAndDelete({_id:req.params.id})
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