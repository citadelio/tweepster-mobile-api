const multer = require('multer');
const path = require('path')

//validate that file is an image
const validateFileType = (file, cb) => {
    const acceptedFileTypes = /jpeg|jpg|png|gif/;
    const fileExt = acceptedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const fileMimetype = acceptedFileTypes.test(file.mimetype);
    if(fileExt && fileMimetype){
        cb(null, true)
    }else{
        cb('Invalid image type', false)
    }
}
    //Set Storage engine 
    const   imageUpload = multer.diskStorage({
                destination: './uploads/',
                filename: (req, file, cb)=>{
                        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
                        }
                    })

//Init upload variable
 
const uploader = multer({
    storage : imageUpload,
    limits : {fileSize: 1024 * 1024 * 10},
    fileFilter: (req, file, cb)=>{
       validateFileType(file, cb)
    }
}).array("tweepster",4)

module.exports = uploader;