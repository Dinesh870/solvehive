
import express from 'express';
import {loginForm, signupForm} from '../controller/userController.js'
const userRouter = express.Router();

userRouter.route('/login').get(loginForm)
userRouter.route('/signup').get(signupForm)

export default userRouter;