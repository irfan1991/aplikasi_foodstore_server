const Product = require('./model')
const Category = require('../categories/model')
const Tag = require('../tags/model')
const path = require('path')
const fs = require('fs')
const config = require('../config')
const { policyFor } = require('../policy')

 async function store(req, res, next) {

    try {

    // let policy = policyFor(req.user)

    // if (!policy.can('create', 'Product')) {
    //     return res.json({
    //         error : 1,
    //         message : 'Anda tidak memiliki akses untuk membuat product'
    //     })
    // }
              // datanya dari client ditangkep daalm variabl payload
    let payload = req.body

        if (payload.category) {
            
            let category = await Category.findOne({name : {$regex : payload.category, $options: 'i'}})

            if (category) {
                payload = {...payload, category : category._id}
            } else {
                delete payload.category
            }
        }

        if (payload.tags && payload.tags.length) {
            
            let tags = await Tag.find({name : {$in : payload.tags}})

            if (tags.length) {
                payload = {...payload, tags: tags.map( tag => tag._id)}
            }
        }

        if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')
            [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            //baca file dilokasi sementara
            const src = fs.createReadStream(tmp_path);

            //pindahkan ke lokasi baru
            const dest = fs.createWriteStream(target_path);

            //pindahkan dri src ke dest
            src.pipe(dest);

            src.on('end', async () => {
                let product = new Product({...payload, image_url : filename});
                await product.save();
                return res.json(product);
              
            }).catch((e) => { return res.json({
                error : 1,
                message : e.message,
                // fields : err.errors
            });});

            // src.on('error', async () => {
            //     // if (err && err.name === 'ValidationError') {
            //         return res.json({
            //             error : 1,
            //             message : err.message,
            //             fields : err.errors
            //         });
                // }
               // next(err)
                //next(err)
            // })
            
        } else {

            let product = new Product(payload)
            await product.save()
            return res.json(product)
            
        }

   
        
    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.json({
                error : 1,
                message : err.message,
                fields : err.errors
            });
        }
        next(err)
    }
   
}

async function index(req, res, next) {
    
    try {
        
        let {limit = 10 , skip = 0 , q = '', category = '', tags = [] } = req.query;

        let criteria = {}

        if (q.length) {
            criteria = {
                ...criteria, name: {$regex : `${q}`, $options :'i'}
            }
        }

        if (category.length) {
            
            category =  await Category.findOne({name : {$regex : `${category}`, $options  :'i'}})

            if (category) {
                criteria = {...criteria, category : category._id}
            }
        }

        if (tags.length) {
            tags = await Tag.find({name : {$in : tags}})
            criteria = {...criteria, tags : {$in : tags.map(tag => tag._id)}}
        }

        let products = await Product.find().limit(parseInt(limit)).skip(parseInt(skip)).populate('category').populate('tags');
        return res.json(products);

    } catch (error) {
        next(error)
    }
}


async function update(req, res, next) {

    try {


    if (!policy.can('update', 'Product')) {
        return res.json({
            error : 1,
            message : 'Anda tidak memiliki akses untuk mengupdate product'
        })
    }
              // datanya dari client ditangkep daalm variabl payload
    let payload = req.body

        if (payload.category) {
                
            let category = await Category.findOne({name : {$regex : payload.category, $options: 'i'}})

            if (category) {
                payload = {...payload, category : category._id}
            } else {
                delete payload.category
            }
        }


        if (payload.tags && payload.tags.length) {
            
            let tags = await Tag.find({name : {$in : payload.tags}})

            if (tags.length) {
                payload = {...payload, tags: tags.map( tag => tag._id)}
            }
        }

        if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')
            [req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            //baca file dilokasi sementara
            const src = fs.createReadStream(tmp_path);

            //pindahkan ke lokasi baru
            const dest = fs.createWriteStream(target_path);

            //pindahkan dri src ke dest
            src.pipe(dest);

            src.on('end', async () => {
                let product = await Product.findOne({_id : req.params.id});

                //dapatkan absolut path
                let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

                //dicek kalau ada 
                if (fs.existsSync(currentImage)) {
                    fs.unlinkSync(currentImage)    
                }

               product  = await Product.findOneAndUpdate({_id: req.params.id},{...payload, image_url : filename},{new : true, runValidators : true});
                return res.json(product);
              
            });

            src.on('error', async () => {

                next(err)
            })
            
        } else {

            let   product  = await Product.findOneAndUpdate({_id: req.params.id},payload,{new : true, runValidators : true});
            await product.save()
            return res.json(product)
            
        }

   
        
    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.json({
                error : 1,
                message : err.message,
                fields : err.errors
            });
        }
        next(err)
    }
   

}

async function destroy(req, res, next) {
    
    try {
        
        let product = await Product.findOneAndDelete({_id: req.params.id});
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
        }

        return res.json(product);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    index,
    update,
    store,
    destroy
}

