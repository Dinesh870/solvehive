import express from "express";
import {
  getLoginForm,
  getProfileUser,
  getRecoverForm,
  getSignupForm,
  logout,
  postLoginFrom,
  sendMailForgatePassword,
  postSignupForm,
  resetPassword,
  sendOTP,
} from "../controller/userController.js";
import { isLoggedIn, validateUserSchema } from "../middlewares.js";
const userRouter = express.Router();

userRouter.route("/login").get(getLoginForm);
userRouter.route("/login").post(postLoginFrom);

userRouter.route("/signup").get(getSignupForm);
userRouter.route("/signup/confirmUser").post(validateUserSchema, sendOTP);
userRouter.route("/signup/confirmUser").put(postSignupForm);

userRouter.route("/logout").get(logout);

userRouter.route('/recoverPassword').get(getRecoverForm);
userRouter.route('/recoverPassword').post(sendMailForgatePassword);
userRouter.route('/resetpassword').post(resetPassword);

userRouter.route("/profile").get(isLoggedIn ,getProfileUser)

export default userRouter;
