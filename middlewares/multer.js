const multer =require('multer');

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
var upload = multer({storage:storage, fileFilter:fileFilter,
     limit:{filesize:1000000, files:5}})
