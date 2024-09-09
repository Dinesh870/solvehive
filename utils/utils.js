import jwt from 'jsonwebtoken'
import randomString from "randomstring";
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator';
import User from '../model/userModel.js';

// check for logout
export const isLoggedOut = (req, res) => {
    const token = req.cookies.token;
    let isLoggedOut;
    if (token) {
      isLoggedOut = false;
    } else {
      isLoggedOut = true;
    }
    return isLoggedOut;
  };

  // functions
// 1: to hash password
export const hashPassword = async (newpassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(newpassword, salt);
    
    return hashedPassword;
};
// const password = await hashPassword("admin@solvehive123")
// console.log(password);


// 2: to generate password
export const generateToken = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

export const generateRandomToken = async (user) => {
  const resetToken = randomString.generate(60); // plain reset token
  const expireTokenTime = Date.now() + 10 * 60 * 1000; // this is in milliseconds

  user.token = resetToken;
  user.resetTokenExpireTime = expireTokenTime;
  await user.save();

  return resetToken;
};

export const generateOPT = ()=>{
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
  return OTP;
}

export const isAdminLogin = async (token) => {
  if(!token) return false;
  const decode = jwt.decode(token);
  const user = await User.findById(decode.id);
  if(!user) return false;
  
  if(user && user.name === decode.role) {
    return true;
  }
  return false;
}