const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//load user model//

require('../models/User');

module.exports=function(passport){
 passport.use(new LocalStrategy({usernameField: 'username'},(username, password, done)=>{
    // console.log(email);//
      //match user//
    User.findOne({
         username:username
     }).then(user=>{
         if(!user){
             return done(null, false, {message:'No user found'});
         }
         //match password//
         bcrypt.compare(password, user.password,(err, isMatch)=>{
             if(err) throw err;
             if(isMatch){
                 return done (null, user);
             }else{
                 return done(null, false, {message: 'password incorrect'})
             }
         })
     })
 }))
 //serialize and deserialize user which enables for login in//
 passport.serializeUser(function(user, done){
     done (null, user.id);
})
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
})


}
