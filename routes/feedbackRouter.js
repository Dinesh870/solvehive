import express from 'express';
import { getFeedbackForm, sendFeedback } from '../controller/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.route("/feedback").get(getFeedbackForm);
feedbackRouter.route("/feedback").post(sendFeedback);


export default feedbackRouter;