import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import {
  isLoggedOut,
  hashPassword,
  generateRandomToken,
  generateToken,
  generateOPT,
  isAdminLogin,
} from "../utils/utils.js";
import ExpressError from "../utils/error.js";
import {sendEmail} from "../utils/email.js";

/** signup form */
export const getSignupForm = (req, res) => {
  const isTrue = isLoggedOut(req, res);
  res.render("./user/signup.ejs", { isTrue });
};
export const sendOTP = async (req, res, next) => {
  try {
    const isTrue = isLoggedOut(req, res);
    const { name, email, password, confirmpassword } = req.body;
    if (password !== confirmpassword) {
      return next(
        new ExpressError(400, "password and confirm password does not match")
      );
    }
    const isMatch = await User.findOne({ email });
    if (isMatch) {
      return next(new ExpressError(409, "Email already exists"));
    }

    // otp generation
    const OTP = generateOPT();
    // sending otp to email of requested user
    const message = `
                      Use below OPT to verify that you are the real user. 
                      \n\n OPT is ${OTP}
                      \n\nif you did not use this otp then remove from your email otherwise i should be very risky
                    `;
    try {
      await sendEmail({
        email: email,
        subject: "OTP verification",
        message: message,
      });

      // const salt = await bcrypt.genSalt(10);
      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        token: OTP,
      });
      await newUser.save();

      res.status(200).render("user/otp.ejs", { isTrue });
    } catch (error) {
      return next(
        new ExpressError(
          500,
          "There was an error sending password reset email. Please try again later."
        )
      );
    }
  } catch (error) {
    next(error);
  }
};
export const postSignupForm = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return next(new ExpressError(400, "All fields are required!"));
    }

    const current_user = await User.findOne({ email });
    if (!current_user) {
      return next(new ExpressError(404, `check email or token or signup again`));
    }
    if (current_user.token !== otp) {
      await User.findByIdAndDelete(current_user._id);
      return next(new ExpressError(400, "something went wrong"));
    }
    // generating the token
    const token = jwt.sign({ id: current_user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    current_user.token = undefined;
    current_user.expireTokenTime = undefined;
    await current_user.save();

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

/** login form */
export const getLoginForm = (req, res) => {
  const isTrue = isLoggedOut(req, res);
  res.render("./user/login.ejs", { isTrue });
};
export const postLoginFrom = async (req, res, next) => {
  
  const {role, email, password } = req.body;
  try {

    const user = await User.findOne({ email });
    
    if (!user) {
      return next(new ExpressError(401, "Email or Password Incorrect!"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ExpressError(401, "Email or Password Incorrect!"));
    }
    if(user && user.token) {
      return next(new ExpressError(400, "User Not Verified"));
    }
    // Generate JWT token
    const payload = {
      id: user._id,
      role: role
    };
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" } // Token expiration time
    );
    res.cookie("token", token, { httpOnly: true, sameSite: 'strict' });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new ExpressError(401, "Already Logout!"));
    }
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res
      .status(200)
      .render("listings/success.ejs", { message: "Logged Out Successfully!" });
    } catch (error) {
      next(error)
    }
};

// forgate password
export const getRecoverForm = (req, res) => {
  const isTrue = isLoggedOut(req, res);
  res.render("./user/forgatePass.ejs", { isTrue });
};
export const sendMailForgatePassword = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  try {
    // 1: get user based on posted email
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return next(new ExpressError(401, "Email Not Found"));
    }
    // 2: generate a random reset token
    const resetToken = await generateRandomToken(user);
    // 3: send the token back to the user email
    const resetUrl = `${resetToken}`;
    const message = `We have recived a password reset token. Please use the below token to reset the password\n\n${resetUrl}\n\nThis token will be valid only for 10 minutes.`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password change request recived!",
        message: message,
      });
      res.status(200).render("./user/resetPass.ejs", { isTrue });
    } catch (error) {
      (user.token = undefined),
        (user.expireTokenTime = undefined),
        await user.save();
      return next(
        new ExpressError(
          500,
          "There was an error sending password reset email. Please try again later."
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (password.length < 8) {
      return res.send("Password length must be 8 character");
    }
    const user = await User.findOne({ token });
    if (!user || user.resetTokenExpireTime <= Date.now()) {
      return next(new ExpressError(400, "Invalid or expired token"));
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.token = undefined;
    user.resetTokenExpireTime = undefined;
    await user.save();

    // login automatically when password reset
    const loginToken = await generateToken(user);
    res.cookie("token", loginToken, { httpOnly: true });
    res.status(200).render("listings/success.ejs", {
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

// about user profile
export const getProfileUser = async (req, res, next) => {
  try {
    const isTrue = isLoggedOut(req, res);
  // const adminLogin = await isAdminLogin(req.cookies.token);
  // const { token } = req.cookies;
  // if (!token) {
  //   return next(new ExpressError(401, "Already Logout!"));
  // }
  const {token} = req.cookies;
  const decode = jwt.decode(token);
  const user = await User.findById(decode.id);
  
  if(!user) {
    next(new ExpressError(400, "Unknown"));
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.redirect('/signup');
    return;
  }
  
  res.render("user/profile.ejs", { isTrue, user });
  } catch (error) {
    next(error);
  }
};
