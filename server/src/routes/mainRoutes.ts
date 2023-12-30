const router = require("express").Router();
import { Request, Response, NextFunction } from 'express'


import { postImages, getImages, deleteImages, signIn, signUp } from '../controllers/mainController'; 
import  {ensureAuthenticated}  from '../config/authenticatedRoutes'; 


router.get('/', (req: Request, res: Response , next: NextFunction)=>{
    res.send('fuck off!!')
})

router.post('/signin', signIn)
router.post('/signup', signUp)

router.get('/getimages', ensureAuthenticated, getImages)
router.post('/uploadimages', ensureAuthenticated, postImages)
router.delete('/deleteimage', ensureAuthenticated, deleteImages)



export default router 