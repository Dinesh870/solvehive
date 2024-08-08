import express from 'express';
import { getAllProblems, getNewProblemForm, getProblemById, getSolutionForm, postNewProblem, postNewSolution, showHomePage, viewSolutions } from '../controller/listingcontroller.js';

const listingRouter = express.Router();

// listing routes
listingRouter.route("/").get(showHomePage);
listingRouter.route("/problems").get(getAllProblems)
listingRouter.route('/problems/new').get(getNewProblemForm)
listingRouter.route('/problems/new').post(postNewProblem)
listingRouter.route("/problems/see/:id").get(getProblemById)
listingRouter.route('/problems/see/:id/solve').get(getSolutionForm)
listingRouter.route('/problems/see/:id/solve').post(postNewSolution)
listingRouter.route('/problems/see/:id/solution').get(viewSolutions)




export default listingRouter;