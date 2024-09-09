import express from "express";
import {
  deleteListing,
  deleteSolution,
  getAllProblems,
  getEditSolutionForm,
  getFormToEdit,
  getNewProblemForm,
  getProblemById,
  getSolutionForm,
  postNewProblem,
  postNewSolution,
  saveEditedForm,
  saveEditedSolution,
  viewSolutions,
} from "../controller/listingController.js";
import { isAdmin, isLoggedIn } from "../middlewares.js";

const listingRouter = express.Router();

/** listing routes */

//public routes
// listingRouter.route("/").get(showHomePage);

// protected routes
listingRouter.route("/").get( getAllProblems);
listingRouter.route("/new").get(isLoggedIn, isAdmin, getNewProblemForm);
listingRouter.route("/new").post(isLoggedIn, isAdmin, postNewProblem);

listingRouter.route("/see/:id/edit").get(isAdmin ,getFormToEdit);
listingRouter.route("/see/:id/edit").post(isAdmin, saveEditedForm);

listingRouter.route("/see/:id/delete").delete(isAdmin,deleteListing);

listingRouter.route("/see/:id").get( getProblemById);
listingRouter.route("/see/:id/solve").get(isLoggedIn,isAdmin, getSolutionForm);
listingRouter
  .route("/see/:id/solve")
  .post(isLoggedIn, isAdmin, postNewSolution);
listingRouter
  .route("/see/:id/solution")
  .get(viewSolutions);
listingRouter.route('/see/:id/solution/delete').delete(isLoggedIn ,isAdmin, deleteSolution);

listingRouter.route('/see/:id/solution/edit').get(isLoggedIn, isAdmin ,getEditSolutionForm);
listingRouter.route('/see/:id/solution/edit').post(saveEditedSolution);

export default listingRouter;
