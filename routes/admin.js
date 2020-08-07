const express = require('express');
const router = express.Router();

require('../models/Feature');
require('../models/User');
const{ensureAuthenticated, allowUser}=require('../helpers/auth');



router.get('/admin',ensureAuthenticated,allowUser, async(req, res, next)=>{
  const news = await Feature.find({category: 'news'}).sort({date:-1}).populate(' user')  
  const ents = await Feature.find({category: 'entertainment'}).sort({date:-1}).populate(' user')  
  const pols = await Feature.find({category: 'politics'}).sort({date:-1}) .populate(' user') 
  const edu = await Feature.find({category: 'education'}).sort({date:-1}).populate(' user')  
    res.render('admins/admin', {news, ents, pols, edu,})
  
})

router.get('/search_users',async (req, res)=>{
  const {query}=req.query;
  const q = new RegExp(query, 'i')
  const users = await User.find({email:q}).populate(' user')
    res.render('admins/user_search', { users, query})

})

router.delete('/user/:id',(req, res)=>{
     User.deleteOne({_id:req.params.id}) 
    .then(()=>{
        
       res.redirect('/admin')
      })
    
    })
  
 
    router.get('/500', (req, res)=>{
      res.render('errors/500')
    })

module.exports = router