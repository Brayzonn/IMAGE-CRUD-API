// Configure multer for handling file uploads

import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: path.resolve('imageuploads'),
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({storage: storage, 
                       limits: {
                        fileSize: 1024 * 1024 * 10,
                       },
                       fileFilter(req, file, cb) {
                        if (!file.originalname.match(/\.(png|jpg)$/)) { 
                           // upload only png and jpg format
                           return cb(new Error('Please upload a Image'))
                         }
                         cb(null, true)
                       }
                       
});

export default upload