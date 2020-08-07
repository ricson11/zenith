const mongoose = require('mongoose');

const Schema=  mongoose.Schema;

const FeatureSchema = new Schema({
    
    title:{
        type:String,
    },
    details:{
        type:String,
    },
    category:{
        type:String,
        },
    date:{
        type:Date,
        default: Date.now
    },
    image:{
        type:String,
    },
    comments:[{

        commentUser:{
            type: Schema.Types.ObjectId,
        ref: 'users'
        },
        commentBody:{
            type:String,
        },
       
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    views:{
        type: Number,
        default:0
    },
    viewedBy:[String],
     seen:{
         type:Number,
         default:0,
     },
})


/*FeatureSchema.methods.increment = async function (user){
    this.views = this.views + 1;
user!== ''
 ?(this.viwedBy = this.viewedBy.push(user.Username))
 : (this.viwedBy = this.viewedBy.push('guest'));
   await this.save({validateBeforeSave:false})
   return this.viewedBy;
}; */



FeatureSchema.methods.increment = async function (){
    this.views = this.views + 1;
   await this.save({validateBeforeSave:false})
   return this.views;


};






module.exports = Feature = mongoose.model('features', FeatureSchema);