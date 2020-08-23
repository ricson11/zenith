const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
const cloudinary = require('cloudinary');
//const smtpTransport = require('nodemailer-smtp-transport');
const upload = require('../middlewares/multer');


dotenv.config({path: '../config/config.env'});


require('../models/User');
require('../models/Feature');


const{ensureAuthenticated, forUser}=require('../helpers/auth');



     router.get('/register',(req, res)=>{
        res.render('users/register')
    })
    
    router.get('/login',(req, res)=>{
        res.render('users/login')
    })
   /* router.post('/login',(req, res, next)=>{
        passport.authenticate ('local',{
            successRedirect:'/features',
            failureRedirect:'/login',
            failureFlash: true
        })(req, res, next);
    })*/

    router.post('/login', function(req, res, next){
      passport.authenticate('local', function(err, user, info){
        if(err) return next(err)
        if(!user){
          req.flash('error_msg', 'Username or password incorrect')
          return res.redirect('/login')
        }
        req.login(user, function(err){
          if(err) return next(err)
         // req.user=user;
          if(req.user.admin){
           return res.redirect('/admin')
          }
          req.flash('login', 'welcome')
         // req.user=user;
          return res.redirect('/features')
        })
      })(req, res, next);
    })
    
     
    router.post('/register',upload.single('photo'),(req, res, )=>{
     cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith'}, function(err, result){
         if(err){
           console.log(err)
         } 
     
      
        if(req.body.admin===process.env.Admin){
            admin=true;
         }else{
             admin=false;
         }
       
         let errors = [];
        if(req.body.password != req.body.password2){
            errors.push({text: 'Password do not match'})
    
        }
        if(req.body.password.length < 4){
            errors.push({text: 'Password must be at least 4 characters'})
        }
        if(errors.length>0){
            res.render('users/register',{
    
                errors:errors,
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                password2:req.body.password2,
                photo:'/photos/'+req.file.filename,
                   
            });
        }else{
            User.findOne({username:req.body.username})
            .then(user=>{
               if(user){
                req.flash('error_msg', 'This username is already registered, login')
                res.redirect('/login')
               }
                else{
                   const newUser = new User({
                       username:req.body.username,
                       email:req.body.email,
                       password:req.body.password,
                       photo:result.secure_url,
                         admin:req.body.admin,
                   });
            //superAdmin 
                if(req.body.username===process.env.superAdmin){
                    newUser.superAdmin=true;
                }

           bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err,hash)=>{
             if(err) throw err;
            newUser.password = hash;
            new User(newUser)
              .save()
              .then(user=>{
                console.log(newUser)
        req.flash('success_msg', 'hi !' +" "+ req.body.username+" "+ 'Your are now registered and can login')
              res.redirect('/login');
          })
          .catch (err=>{
        console.log(err);
         return;
         })
         })
      })
     }
     })
     }
    })  //end here
      process.NODE_TLS_REJECT_UNAUTHORIZED='0'
         User.findOne({username:req.body.username})
         .then(user=>{
         if(user){
            req.flash('error_msg', 'The username already registered so your details cnnot be send')
         }else{
          let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user:process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASS,
               
            },
            tls:{
              rejectUnauthorized:false,
            }
        });
          
          // send mail with defined transport object
         var mailOptions={
            
           from:'Zenith Forum <noreply.elizaofficial5@gmail.com>',// list of receivers
           to:req.body.email ,// list of receivers
           subject:"your registration details of Zenith Forum", // Subject line//
            html: `<b style="color:black"><h3>Welcome ${req.body.username}, the below is your registration details</h3></b>
             <p><b style="color:black">Username:</b> ${req.body.username}</p>
               <p><b style="color:black">Email:</b> ${req.body.email}</p>
               <p> <a href="http://localhost:700/login">Login</a></p>
                  `,
              // template:'email',
        
         };
         transporter.sendMail(mailOptions, function(error, info){
             if (error){
                 console.log(error)
             }else{
                 console.log('email sent' + info.response);
             }
         })
        }
        })   
 })


 router.get('/logout', (req, res, next)=>{
     req.logout();
     req.flash('success_msg', 'you logged out')
     res.redirect('/')
 })
    
    
 router.get('/users/edit/:id', ensureAuthenticated,async(req, res, next)=>{
     try{
         const user=  await User.findOne({_id:req.params.id})
         res.render('users/edit',{user})

     }
     catch (err){
         console.log(err.message)
         next(err)
     }
 })


router.get('/profile', ensureAuthenticated,(req, res)=>{
    User.findOne({user:req.user.id})
    res.render('users/profile')
})
router.put('/users/:id', (req, res)=>{
   
  
    if(req.body.admin==='abc'){
        admin=true;
     }else{
         admin=false;
     }
     User.findOne({_id:req.params.id})
    .then(user=>{
        
      user.username=req.body.username,
        user.email = req.body.email,
        user.admin=req.body.admin,
        
        user.save()

    })
    .then(user=>{
    req.flash('success_msg', 'Profile updated successfully')

        res.redirect('/')
    })
    .catch(err=>{
        console.log(err)
    })
  })





/*router.get('/features/user/:userId', async(req, res)=>{
  const features = await  Feature.find({})
    res.render('username', {features})
})*/

router.get('/forgot', (req, res)=>{
    res.render('users/forgot')
})

      //process.NODE_TLS_REJECT_UNAUTHORIZED='0'

    router.post('/forgot', function(req, res, next) {
        async.waterfall([
          function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
          },
          function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
              if (!user) {
                req.flash('error_msg', 'No account with that email address exists.');
                return res.redirect('/forgot');
              }
      
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
              user.save(function(err) {
                done(err, token, user);
              });
            });
          },
          function(token, user, done) {
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                  user:process.env.GMAIL_EMAIL,
                  pass: process.env.GMAIL_PASS,
                 
              },
              tls:{
                rejectUnauthorized:false,
              }
          });
            var mailOptions = {
              to: user.email,
              from: 'Zenith Forum <noreply.elizaofficial5@gmail.com>',
              subject: 'Zenith Forum Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.hostname + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
              req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
              done(err, 'done');
            });
          }
        ], function(err) {
          if (err) return next(err);
          res.redirect('/forgot');
        });
      });

      //end of forget post

//Gettin the reset token


router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('users/reset',{token: req.params.token});
    });
  });





router.get('/reset', (req, res)=>{
    res.render('users/reset')
})




router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
            if(req.body.password.length < 4){
               req.flash('error_msg', 'Password must be atleast 4 character.')
               return res.redirect('back')
            }
           if(req.body.password === req.body.password2){
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
                
           bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err,hash)=>{
             if(err) throw err;
            user.password = hash;
            console.log(user.password)
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
        });
      } else{
        req.flash('error_msg', 'Passwords do not match.');
         return res.redirect('back');
      }
      })
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          tls:{
              rejectUnauthorized:false,
          },
          auth: {
            user: 'elizaofficial5@gmail.com',
            pass: 'wonder5555'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'Zenith Forum Password Reset<noreply.elizaofficial5@gmail.com>',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
         
          req.flash('success_msg', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });


  router.get('/user/:id' , async(req, res)=>{
     const user = await User.findOne({_id:req.params.id})
     .populate('user')
     res.render('users/read' ,{user})
  })







      module.exports = router;