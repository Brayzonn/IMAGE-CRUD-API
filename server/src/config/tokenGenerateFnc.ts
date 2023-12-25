
//env variable
require('dotenv').config();

//generate user token
import jwt from 'jsonwebtoken';

const generateUserToken = (id: any) => {
    // Check if process.env.JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default generateUserToken