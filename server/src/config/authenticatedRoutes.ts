const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
require('dotenv').config();


declare global {
    namespace Express {
      interface Request {
        userId?: string; 
      }
    }
  }


const ensureAuthenticated = function(req: Request, res: Response , next: NextFunction) {
    let Usertoken;
   
    const UserauthHeader = req.headers.authorization;

    if (!UserauthHeader) {
        return res.json({ errMsg: 'Unauthorized Access.' });
    }
   
    // Remove quotes from the token
    Usertoken = UserauthHeader.replace(/['"]+/g, '').split(' ')[1];

    try {
        const decoded =  jwt.verify(Usertoken, process.env.JWT_SECRET);
        
        if (!decoded.id) {
            return res.json({ errMsg: 'Unauthorized Access.' });
        } else {
            // Access the user ID or any other information stored in the token
            const userId = decoded.id._id;
            
            // Pass the user ID or other information to the next middleware or route handler
            req.userId = userId;

            // Call the next middleware or route handler
            next();
        }
    } catch (error) {
        res.status(500).json({status: false, message: 'internal server error'})
        console.log(error);
    }
};

export {ensureAuthenticated} 
