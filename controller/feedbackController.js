import { isLoggedOut } from "../utils/utils.js";
import {sendFeedbackMail} from '../utils/email.js';
import User from "../model/userModel.js";
import ExpressError from "../utils/error.js";

export const getFeedbackForm = (req, res, next) => {
    try {
        const isTrue = isLoggedOut(req, res); 
        res.status(200).render("feedback/feedbackForm.ejs", {isTrue});
    } catch (error) {
        next(error);
    }
}

export const sendFeedback = async (req, res, next) => {
    try {
        const {userName, email, subject, feedbackmessage} = req.body;
        try {
            await sendFeedbackMail ({
              email: email,
              subject: subject,
              message: feedbackmessage,
            });
            res.status(200).redirect("/");
          } catch (error) {
            const user = await User.findOne({email});
            (user.token = undefined),
              (user.expireTokenTime = undefined),
              await user.save();
            return next(
              new ExpressError(
                500,
                "There was an error sending feedback. Please try again later."
              )
            );
          }
    } catch (error) {
        next(error);
    }
}