import express from 'express';
import { getAllProblemOfTheDayProblems } from '../controller/problemOfTheDayController.js';

const problemOfTheDayRouter = express.Router();

problemOfTheDayRouter.route('/problem-of-the-day').get(getAllProblemOfTheDayProblems);

export default problemOfTheDayRouter;