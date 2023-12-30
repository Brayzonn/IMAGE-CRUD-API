// Configure multer for handling file uploads

import multer from 'multer';
import path from 'path';



const imageStorage = multer.diskStorage({
    destination:  path.join(__dirname, '../imageuploads'),
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({storage: imageStorage, 
                       limits: {
                        fileSize: 1024 * 1024 * 10,
                       },
                       fileFilter(req, file, cb) {
                        if (!file.originalname.match(/\.(png|jpg|svg)$/)) { 
                           // upload only png and jpg format
                           return cb(new Error('Please upload a Image'))
                         }
                         cb(null, true)
                       }                                   
});

export default upload