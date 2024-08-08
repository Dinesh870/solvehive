import Problems from "../model/problemModel.js";
import Solution from "../model/solutionModel.js";
import mongoose from "mongoose";

// show home page
export const showHomePage = (req, res) => {
  res.render("listings/home.ejs");
};

// showing all problems
export const getAllProblems = async (req, res) => {
  try {
    const problemList = await Problems.find();
    res.render("listings/listings.ejs", { problemList });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Show form to add a new problem
export const getNewProblemForm = (req, res) => res.render("listings/new.ejs");

// Handle form submission to add a new problem
export const postNewProblem = async (req, res) => {
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
      sampleexample: sampleExampleData,
      constraints: result.constraints,
      date: Date.now(),
    });

    await newProblem.save();
    res.redirect("/problems");
  } catch (err) {
    res.status(400).send(err);
  }
};

// Show individual problem
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problems.findById(id);
    if (!problem) return res.status(404).send("Problem not found!");
    res.render("listings/details.ejs", { problem });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Show form to add a solution
export const getSolutionForm = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problems.findById(id);
    if (!problem) return res.status(404).send("Problem not found!");
    res.render("listings/solutionForm.ejs", { problem });
  } catch (err) {
    console.error(err);
    res.status(404).json(err);
  }
};

// Handle form submission to add solution of a problem
export const postNewSolution = async (req, res) => {
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
    res.redirect(`/problems/see/${id}`);
  } catch (err) {
    res.status(400).json(err);
  }
};

//  Display solutions for a problem
export const viewSolutions = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ message: "Not Found!" });

  try {
    const problem = await Problems.findById(id);
    const solution = await Solution.find({ problemId: id });
    res.render("listings/solution.ejs", { problem, solution });
  } catch (err) {
    res.status(404).send(err);
  }
};
