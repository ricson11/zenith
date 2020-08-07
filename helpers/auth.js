
require('../models/User')
require('../models/Feature')


module.exports={
    ensureAuthenticated: function (req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
            req.flash('error_msg', 'Not permitted')
            res.redirect('/login')
      
       
    },
    checkUser: function(req, res, next){
        const feature = Feature.findOne({_id:req.params.id})
        if(feature.user!=req.user.id){
            return next()
        }else{
            req.flash('error_msg', 'Not permitted')
            res.redirect('/admin')
        }
    },
    allowUser: function(req, res, next){
          if(req.isAuthenticated()){
            const user = User.findOne({_id:req.user.id})
            if(req.user.admin){
                return next()
            }
            req.flash('error_msg', 'Restricted page for admin only!')
             res.redirect('/')
        }
        
          },
          
        forUser:function(req, res, next){
            if(req.isAuthenticated()){
                const user = User.findOne({username:req.body.username})
                if(user){
                    return next()
                }
                req.flash('error_msg', 'Restricted !')
                res.redirect('/forgot')
            }
        }
}