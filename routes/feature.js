const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
//const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer =require('multer');
const upload = require('../middlewares/multer');
//const env = require('dotenv');
require('../models/Feature');
require('../models/User');
 const{ensureAuthenticated}=require('../helpers/auth');
 
 //env.config({path:'../config/.env'});


     router.get('/', async(req, res)=>{
        const news1 = await Feature.find({category: 'news'}).sort({date:-1}).limit(1).populate(' user') 
        const news2 = await Feature.find({category: 'news'}).sort({date:-1}).skip(1).limit(1).populate('user')
        const news3 = await Feature.find({category: 'news'}).sort({date:-1}).skip(2).limit(1).populate(' user')
        const pols1 = await Feature.find({category: 'politics'}).sort({date:-1}).limit(1).populate(' user')
        const pols2 = await Feature.find({category: 'politics'}).sort({date:-1}).skip(1).limit(1).populate(' user')
        const pols3 = await Feature.find({category: 'politics'}).sort({date:-1}).skip(2).limit(1).populate(' user')
        const edu1 = await Feature.find({category: 'education'}).sort({date:-1}).limit(1).populate(' user')
        const edu2 = await Feature.find({category: 'education'}).sort({date:-1}).limit(1).skip(1).populate(' user')
        const edu3 = await Feature.find({category: 'education'}).sort({date:-1}).limit(1).skip(2).populate(' user')
        const ent1 = await Feature.find({category: 'entertainment'}).sort({date:-1}).limit(1).populate(' user')
        const ent2 = await Feature.find({category: 'entertainment'}).sort({date:-1}).skip(1).limit(1).populate(' user')
        const ent3 = await Feature.find({category: 'entertainment'}).sort({date:-1}).skip(2).limit(1).populate(' user')
        const trending = await Feature.find({}).sort({date:-1}).limit(1)
        const trending2 = await Feature.find({}).sort({date:-1}).skip(1).limit(1)
        const trending3 = await Feature.find({}).sort({date:-1}).skip(2).limit(1)
        const userCount = await User.countDocuments()
        const featureCount = await Feature.countDocuments()
          .populate('user')
      res.render('index', {news1, news2, news3, pols1, pols2,pols3,
                              edu1, edu2, edu3, ent1, ent2, ent3, trending,
                              trending3, trending2,userCount, featureCount,
        })
    })
    
    router.get('/features',async(req, res, next)=>{
      try{
        const posts = await Feature.find({}).sort({views:-1}).limit(10).populate(' user') 
        const posts1 = await Feature.find({}).sort({date:-1}).limit(7).populate(' user')
        const trending = await Feature.find({}).sort({date:-1}).limit(1)
        const trending2 = await Feature.find({}).sort({date:-1}).skip(1).limit(1)
        const trending3 = await Feature.find({}).sort({date:-1}).skip(2).limit(1)
        const userCount = await User.countDocuments()
        const featureCount = await Feature.countDocuments()
        .populate('user')
         
        res.render('index', {posts, posts1, trending, trending2, trending3, userCount, featureCount})
    }
    catch(err){
        console.log(err)
        return next(err)
    }
    
    })
    




    router.get('/add', ensureAuthenticated,(req, res,)=>{
       res.render('features/add')
    })


    /*this is meant to be an async funtion ... also use try catch just as i did in the 

    the othe files use this pattern in all your queries */
 
   
router.get('/edit/:id', ensureAuthenticated,async(req, res , next)=>{

    try

    {

        //wrapping the codes in a try block in order to get the asynchronous errors

        //handling promise rejections
        const feature = await Feature.findOne({_id:req.params.id})

        if(feature.user==req.user.id || req.user.admin){
           
            res.render('features/edit', {feature})

          }else{
            req.flash('error_msg', 'not permitted')
            res.redirect('/admin')
          }
           

        
       
    }

    catch(err)

    {

        console.log(err.message)
        next(err)
    }
   
})
 

    
    router.post('/features',upload.single('image'),async(req, res)=>{
       cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith'}, function(err, result){
           if(err){
               console.log(err);
           }
       
        
        const newFeature={
            title:req.body.title,
            details:req.body.details,
            category: req.body.category,
            image: result.secure_url,
            user: req.user.id,
        }
       
         new Feature (newFeature)
        .save()
        .then(features=>{
            console.log(newFeature)
            res.redirect('/')
        })     // console.log(newFeature)
    })
    })
    router.put('/features/:id', (req, res)=>{
        Feature.findOne({_id:req.params.id})
        .then(feature=>{
            feature.title=req.body.title,
            feature.details=req.body.details,
            feature.category=req.body.category,
            
            feature.save()
            .then(feature=>{
                res.redirect('/')
            })
        })
        .catch(err=>{
            console.log(err)
        })
    })

 router.delete('/features/:id',upload.single('image'),(req, res)=>{
     
     Feature.deleteOne({_id:req.params.id})
     .then(()=>{
         res.redirect('/')
     })
 
 })

 router.get('/entertainment',async(req, res)=>{
 ent = await Feature.find({category: 'entertainment'}).sort({date:-1}).limit(7)
 ents = await Feature.find({category: 'entertainment'}).sort({date:-1})
 .skip(7).limit(4)

     res.render('entertainment',{ent, ents})
 })
 
 router.get('/news',async(req, res)=>{
     news = await Feature.find({category: 'news'}).sort({date:-1}).limit(7)
     later = await Feature.find({category: 'news'}).sort({date:-1})
     .skip(7).limit(4)
   const users = await User.find({})
    res.render('news', {news, later, users})
})

router.get('/education',async(req, res)=>{
 edu = await Feature.find({category: 'education'}).sort({date:-1})
 .limit(7)
 edus = await Feature.find({category: 'education'}).sort({date:-1})
 .skip(7).limit(4)
  .populate(' user')
    res.render('education',{edu, edus})
})

//this is ok .. the only thing lacking is handling the promie if rejected ..

//everyy async function returns a promise and they must be handled .. else ... bugs

// Read About Promise in JS



router.get('/politics',async(req, res)=>{
    pol = await Feature.find({category: 'politics'}).sort({date:-1})
    .limit(7)
    pols = await Feature.find({category: 'politics'}).sort({date:-1})
    .skip(7).limit(4)
   
       res.render('politics',{pol, pols})
   })




//read more



router.get('/features/:id', async(req, res , next)=>{

    try

    {

      
        const feature = await Feature.findOne({_id:req.params.id})
        .populate('user')
        .populate('comments.commentUser')
          
        feature.increment()

      
        const q = new RegExp(feature.category, 'i')
        const related = await Feature.find({category:q})
        .sort({date:-1}).limit(3).populate(' user')
       
        const popular = await Feature.find({}).sort({ views:-1}).limit(3).populate(' user')
    res.render('features/more', {feature, related, popular})
          //console.log(req.user)
    }

    catch(err)

    {

        console.log(err.message)
        next(err)
    }
   
})





router.post('/features/comment/:id', (req, res)=>{
            Feature.findOne({_id:req.params.id})
            .then(feature=>{
               const newComment={
              commentBody:req.body.commentBody,
              commentUser:req.user.id,
            }  
            feature.comments.unshift(newComment)
            feature.save()
            .then(feature=>{
                res.redirect('/features/'+ feature._id)
            })
     })
})

router.get('/features/comment/:id',async (req, res)=>{
    const feature = await Feature.findOne({_id:req.params.id})
   
    res.render('features/more', {feature})
});


router.get('/myposts',ensureAuthenticated, async(req, res, )=>{
  const posts = await Feature.find({user:req.user.id})
  .sort({date:-1}).populate('user')
    res.render('myposts', {posts})


});

/*router.get('/features/user/:userId', (req, res, next)=>{
    Feature.find({user:req.params.userId})
    .populate('user')
    .sort({date:-1})
    .then(features=>{
        res.render('features/userposts',{
            features:features
        })
    })
    .catch(err=>{
        console.log(err)
        next();
    })
})*/
//user profile and posts
router.get('/user/:userId/:userUsername', async(req, res, next)=>{
    try{
        const features = await Feature.find({user:req.params.userId})
         .sort({date:-1}).populate('user')
         const profile = await Feature.find({user:req.params.userId}).limit(1).populate('user')
        res.render('features/userposts', {features, profile})
    }
    catch(err){
        console.log(err)
        next();
    }
})


router.get('/search', async(req, res)=>{
    const {query}=req.query;
    const q = new RegExp(query, 'i')
    const features = await Feature.find({$or:[{details:q}, {title:q}]})
    .sort({date:-1}).populate(' user')
    res.render('search_results', {query, features})
})



     module.exports=router;

     //Am Out Let's Chat