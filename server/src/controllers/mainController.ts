import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import generateUserToken from '../config/tokenGenerateFnc';
import signInFnc from '../config/signinLogic';
import upload from '../middleware/multerConfig';
import userModel from '../models/usermodel'

//env variable
require('dotenv').config();


//handle get user images logic
const getImages = async (req: Request, res: Response , next: NextFunction) => {
  
    try {
        const user = req.userId;

        // find user data in db
        const userData = await userModel.findOne({_id: user})

        const imageDirectory = path.resolve('imageuploads');

        // Read files from the directory
        fs.readdir(imageDirectory, (err, files) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error reading directory' });
            }

            // Find the image file by name
            const foundImage = files.find((file) => file === user);

            if(foundImage && userData){
                const imagePath = path.join(imageDirectory, foundImage);
                // Set the JSON data as a header
                res.set('User-Data', JSON.stringify(userData));
                // Send the image file to the client
                res.sendFile(imagePath);  
            }else{
                return res.status(401).json({status: false, message: 'Unauthorized'})
            }
        })  

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error' });   
    }  

}

// handle image delete logic
const deleteImages = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const user = req.userId;

        const {fileID} = req.body;

        const filePath = `imageuploads/${user}-${fileID}`;

        //check for and then delete files from the directory
        if (fs.existsSync(filePath)) {
            // Delete the file from the directory
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ success: false, message: 'Error deleting file' });
                }
                return res.status(200).json({ success: true, message: 'File deleted successfully' });
            });
        } else {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error' });   
    }  
}


//upload user logic
const postImages = async (req: Request, res: Response , next: NextFunction) => {

    try {
         upload.array('images', 4)(req, res, async (err: any) => {

            if (err instanceof multer.MulterError) {
                return res.status(500).json({ success: false, message: 'File upload error' });
            }
      
            return res.status(200).json({ success: true, images: 'Image(s) Updated Successfully'});
        });      
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error' });
    }  

}

export { postImages, getImages, deleteImages };