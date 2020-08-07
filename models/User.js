const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
   
    email:{
        type:String,
        unique:true,
    },
    username:{
        type:String,
        unique:true,
    },
    photo:{
        type:String
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    superAdmin:{
        type:Boolean,
        default:false,
    },
    admin:{
        type:String,
    },
    feature:{
        type: Schema.Types.ObjectId,
        ref: 'features'
    },
  
    resetPasswordToken:String,
    
    resetPasswordExpires:Date,
})

//UserSchema.plugin(passportLocalMongoose);

module.exports = User = mongoose.model('users', UserSchema)