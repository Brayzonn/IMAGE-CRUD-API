import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import path from 'path';
import bcrypt from 'bcrypt'
import fs from 'fs';

import generateUserToken from '../config/tokenGenerateFnc';
import validateLogin from '../config/signinLogic';
import upload from '../middleware/multerConfig';
import userModel from '../models/usermodel'

//env variable
require('dotenv').config();

//handle sign in
const signIn = async (req: Request, res: Response , next: NextFunction) => {

    try {
        const {email, password} = req.body;

        //validate sign in attempt
        const signInResponse = await validateLogin(email, password);

        //check for sign in errors 
        if (signInResponse.errMSGmessage) {
            return res.status(404).json({ status: false, message: signInResponse.errMSGmessage });
        } 

        //generate token if no errors
        const token = generateUserToken(signInResponse.userId);   

        //send data to client
        res.status(200).json({ status: true, message: [{"token": token}, signInResponse] })
 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Something went wrong, please try again later' });      
    }

}

//handle sign up 
const signUp = async (req: Request, res: Response , next: NextFunction) => {

    try {
        const {username, email, password} = req.body;

        //check required fields
        if( !username || !email || !password){
           return res.status(200).json({ status: false, message: 'Please enter all fields' })
        }
    
        // check valid email
        let emailPattern= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
        if(!email.match(emailPattern)){
            return res.status(200).json({ status: false, message: 'Invalid email pattern' })
        }
    
        //password length and min characters
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,20}$/;
    
        if(!password.match(passwordRegex)){
            return res.status(200).json({ status: false, message: 'Password should contain at least 6 characters. An uppercase letter, lowercase letter, number, and a special character.'  }) 
        }
        else{
            const userResponse = await userModel.findOne({email:email.toLowerCase()})
    
            if(userResponse){
                return res.status(200).json({status: false, message: 'User with this email already exists.' });
            }else{
                const newUser = new userModel({
                    email: email,
                    username: username,
                    role: true,
                    password,
                })

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newUser.password, salt);
                newUser.password = hash;

                // Save user
                await newUser.save();

                //send success message to client
                res.status(200).json({status: true, message: 'User Registered Successfully, Please Wait.'});

            }
        }        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Something went wrong, please try again later' });        
    }

}


//handle get user images logic
const getImages = async (req: Request, res: Response , next: NextFunction) => {
  
    try {
        const user: string = req.userId || '';

        // find user data in db
        const userData = await userModel.findOne({_id: user})

        const imageDirectory = path.resolve('src/imageuploads');

        // Read files from the directory
        fs.readdir(imageDirectory, (err, files) => {
            if (err) {
                console.error(err); // Log the specific error for debugging
                return res.status(500).json({ success: false, message: 'Error reading directory' });
            }

            // Find the image file by name
            const imageFiles = files.filter((file) => file.startsWith(user));
            

            if(imageFiles && userData){
                const imagePaths = imageFiles.map((file) => path.join(imageDirectory, file));
                // Set the JSON data as a header
                res.set('User-Data', JSON.stringify(userData));
                // Send the image file to the client
                res.json({imagePaths});  
            }else{
                return res.status(401).json({status: false, message: 'Unauthorized'})
            }
        })  

    } catch (error) {
        res.status(500).json({ status: false, message: 'Something went wrong, please try again later' });   
    }  

}

// handle image delete logic
const deleteImages = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const user: string = req.userId || '';

        const {fileID} = req.body;

        // image to be deleted
        const imageToBeDeleted = `${user}-${fileID}`;

        // File path
        const filePath = path.resolve(`src/imageuploads/${imageToBeDeleted}`);

        //check if file exists in filepath and then delete file from the directory
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
        res.status(500).json({ status: false, message: 'Something went wrong, please try again later' });   
    }  
}

//upload photos logic
const postImages = async (req: Request, res: Response , next: NextFunction) => {

    try {
        // Check if no files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        upload.array('images', 4)(req, res, function (err: unknown) {
            //check for errors
            if (err instanceof MulterError) {
                return res.status(400).json({ success: false, message: err });
            } else if (typeof err === 'string') {
                return res.status(400).json({ success: false, message: err });
            } else {
                return res.status(200).json({ success: true, message: 'Images uploaded successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong, please try again later' });
    }

}

export { postImages, getImages, deleteImages, signIn, signUp };