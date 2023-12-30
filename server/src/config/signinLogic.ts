import bcrypt from 'bcryptjs';
import userModel from '../models/usermodel';


//function to validate user sign in
const validateLogin = async (email: string, password: string ) => {
    //check db for user
    const userResp =  await userModel.findOne({ email: email })

    //if user exists
    if (userResp){
        //check password
        const validatePassword = await comparePasswordWithHash(password, userResp.password);

        if(!validatePassword){
            return ({ errMSGmessage: 'Incorrect Password!' })
        }else{
           return({successMessage: 'Sign in successful', userId: userResp}) 
        }
    }else{
        return ({ errMSGmessage: 'No account found.' });
    }
}

const comparePasswordWithHash = async (password: any, hashedPassword: any) => {
    return bcrypt.compare(password, hashedPassword);
};

export default validateLogin