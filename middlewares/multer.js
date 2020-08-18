const multer =require('multer');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env'});

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret
});



//module.exports= parser = multer({storage: storage})
/*Cloud name:	
dvyhqcxxe
API Key:	
861435413366947
 
API Secret: IP6LKMgaqac4kYAhP_a8nG-XhAc
*/

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads')
    },
    filename:function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now())
    },
    
});
function fileFilter(req, file, cb){
    if(file.mimetype ==='image/jpg' || file.mimetype==='image/jpeg'
    || file.mimetype==='image/png'){
        cb(null, true)
    }else{
        cb(new Error('image is not supported'), false)
    }
}
module.exports = upload = multer({storage:storage, fileFilter:fileFilter,
     limit:{filesize:1000000}})
