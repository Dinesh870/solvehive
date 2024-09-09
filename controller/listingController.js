import { isAdminLogin, isLoggedOut } from "../utils/utils.js";
import Problems from "../model/problemModel.js";
import Solution from "../model/solutionModel.js";
import mongoose from "mongoose";
import ExpressError from "../utils/error.js";
import { sort_problem_in_increasing_order, sort_reverse_order } from "../utils/filter.js";
import { isAdmin } from "../middlewares.js";

// showing all problems
export const getAllProblems = async (req, res, next) => {
  const difficulty = req.query.difficulty || 'all';
  const filter = req.query.filter || 'no-filter';
  
  const isTrue = isLoggedOut(req, res);
  try {
    const adminLogin = await isAdminLogin(req.cookies.token);  

    let query = {};
    if(difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const total_problems = await Problems.find(query).countDocuments();
    const total_page = Math.ceil(total_problems/limit);

    const skip = (page-1)*limit;
    let problemList = await Problems.find(query).skip(skip).limit(limit);    

    if(filter === 'default') {
      problemList = sort_problem_in_increasing_order(problemList);
    } else if(filter === 'reverse') {
      problemList = sort_reverse_order(problemList);
    }
    
    res.render("listings/listings.ejs", { problemList, isTrue, adminLogin, difficulty, filter, total_page });
  } catch (err) {    
    next(err);
  }
};

// Show form to add a new problem
export const getNewProblemForm = (req, res) => {
  const isTrue = isLoggedOut(req, res);
  res.render("listings/new.ejs", { isTrue });
};

// Handle form submission to add a new problem
export const postNewProblem = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  const result = req.body;
  
  try {
    const sampleExampleData = (
      Array.isArray(result.input) ? result.input : [result.input]
    ).map((input, index) => ({
      input: result.input[index],
      output: result.output[index],
      explanation: result.explanation[index],
    }));

    const newProblem = new Problems({
      problemname: result.problemname,
      problemstatement: result.problemstatement,
      difficulty: result.difficulty,
      sampleexample: sampleExampleData,
      constraints: result.constraints,
      date: Date.now(),
    });

    const savedproblem = await newProblem.save();
    
    res.redirect(`/problems/see/${savedproblem._id}`);
  } catch (err) {
    next(err);
  }
};

// Show individual problem
export const getProblemById = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  const { id } = req.params;
  try {
    const adminLogin = await isAdminLogin(req.cookies.token);
    const problem = await Problems.findById(id);
    if (!problem) {
      return next(new ExpressError(404, "Problem Not Found"));
    }
    res.render("listings/details.ejs", { problem, isTrue, adminLogin });
  } catch (err) {
    next(err);
  }
};

// Edit Posted Problem
export const getFormToEdit = async (req, res, next) => {
  try {    
    const isTrue = isLoggedOut(req, res);
    const {id} = req.params;
    const problem = await Problems.findById(id);

    res.render('listings/problemEditForm.ejs', {problem, isTrue});
  } catch (error) {
    next(error)
  }
}
// save edit form
export const saveEditedForm = async (req, res, next) => {
  try {
    const {id} = req.params;

    const updateData = req.body;    
    
    if(typeof updateData.input === 'string') {
      updateData.input = [updateData.input]
    }

    if(typeof updateData.output === 'string') {
      updateData.output = [updateData.output]
    }

    if(typeof updateData.explanation === 'string') {
      updateData.explanation = [updateData.explanation]
    }

    const transformedData = {
      problemname: updateData.problemname,
      difficulty: updateData.difficulty,
      problemstatement: updateData.problemstatement,
      sampleexample: updateData.input.map((input, index) => ({
        input,
        output: updateData.output[index] || '', // Handle case where output might be missing
        explanation: updateData.explanation[index] || '' // Handle case where explanation might be missing
      })),
      constraints: updateData.constraints
    };    

  const result = await Problems.findByIdAndUpdate(id, transformedData, {new : true});

  res.status(200).render('listings/success.ejs', {message: "Problem Edited Successfully!", href: `/problems/see/${id}`, pathMsg: "see problem"})
  } catch (error) {
    next(error);
  }
}

// deleting listing 
export const deleteListing = async (req, res, next) => {
  try {
    const {id} = req.params;
    const deletedProblem = await Problems.findByIdAndDelete(id);
    res.status(200).render("listings/success.ejs", {message: "Successfully deleted"});
  } catch (error) {
    next(error);
  }
}

// Show form to add a solution
export const getSolutionForm = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  const { id } = req.params;
  try {
    const problem = await Problems.findById(id);
    if (!problem) {
      return next(new ExpressError(404, "Problem Not Found"));
    }
    res.render("listings/solutionForm.ejs", { problem, isTrue });
  } catch (err) {
    next(err);
  }
};

// Handle form submission to add solution of a problem
export const postNewSolution = async (req, res, next) => {
  const { id } = req.params;
  const result = req.body;
  
  try {
    const newSolution = new Solution({
      problemId: id,
      methodName: result.method,
      intuition: result.Intuition,
      algorithm: result.algorithms,
    });

    await newSolution.save();
    res.status(200).redirect(`/problems/see/${id}`);
  } catch (err) {
    next(err);
  }
};

//  Display solutions for a problem
export const viewSolutions = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  const adminLogin = await isAdminLogin(req.cookies.token);
  
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError(404, "Solution Not found"));
    }
    const problem = await Problems.findById(id);
    if (!problem) {
      return next(new ExpressError(404, "Problem Not Found"));
    }
    const solution = await Solution.find({ problemId: id });

    res.status(200).render("listings/solution.ejs", { problem, solution, isTrue, adminLogin });
  } catch (err) {
    next(err);
  }
};

export const getEditSolutionForm = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  try {
    const {id} = req.params;

    const solution = await Solution.findById(id);
    if(!solution) {
      return next(new ExpressError(404, "Solution Not Found"));
    }
    res.status(200).render('listings/editSolutionForm.ejs', {solution, isTrue});
  } catch (error) {
    next(error);
  }
}

export const saveEditedSolution = async (req, res, next) => {
  try {
    const result = req.body;
    const {id} = req.params;

    const isTrue = isLoggedOut(req, res);

    const updateFields = {
      methodName: result.method,
      intuition: result.Intuition,
      algorithm: result.algorithms,
    };

    const newData = await Solution.findByIdAndUpdate(id, updateFields, {new: true});    

    if(!newData) {
      return next(new ExpressError(500, "Internal Server Error!"));
    }

    res.status(200).render('listings/success.ejs', {message: "Solution Submitted Successfully!", href: `/problems`, pathMsg: "go to problem list"});
  } catch (error) {
    next(error);
  }
}

export const deleteSolution = async (req, res, next) => {
  try {
    const {id} = req.params;
    
    const deletedSolution = await Solution.findByIdAndDelete(id);
    if(!deleteSolution) {
      return next(new ExpressError(402, "Not Found!"));
    }
    res.render('listings/success.ejs', {message: "Successfully Deleted!", href: `/problems/see/${deletedSolution.problemId}/solution`, pathMsg: "see other solution"})
  } catch (error) {
    next(error);
  }
}