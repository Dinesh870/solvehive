import { isAdminLogin, isLoggedOut } from "../utils/utils.js";

export const getAllProblemOfTheDayProblems = (req, res, next) => {
    try {
        const isTrue = isLoggedOut(req, res);         
        res.status(200).send("this is under process");
    } catch (error) {
        next(error);
    }
}