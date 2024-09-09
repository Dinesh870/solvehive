import jwt from "jsonwebtoken";
import { userSchema } from "./joiValidation.js";
import ExpressError from "./utils/error.js";
import { isLoggedOut } from "./utils/utils.js";
import User from "./model/userModel.js";

export const isLoggedIn = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.redirect("/login");
    return;
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
    if (err) {
      const errBox = {
        statusCode: err.status || 401,
        title: err.title || "Invalid token",
        message:
          err.message ||
          "An unexpected error occurred. Please try again later.",
      };
      // Render the error page with the error details
      res.cookie("token", "", { expires: new Date(0), httpOnly: true });
      return res.status(errBox.statusCode).render("listings/error", { errBox });
    }
    req.user = result;
    next();
  });
};

// validate user schema middleware
export const validateUserSchema = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    console.log(error);
    
    const errMsg = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMsg));
  } else {
    next();
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ExpressError(404, "Not Found"));
    }
    const decode = jwt.decode(token);
    const user = await User.findById(decode.id);
    if(user && user.name === decode.role) {
      return next()
    } 
    return next(new ExpressError(403, "ACCESS DENIED!"))
  } catch (error) {
    return next(error);
  }
};
