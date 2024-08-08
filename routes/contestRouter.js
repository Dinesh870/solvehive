import express from 'express';
import {codeforcesContests, getAllContests, gfgContests} from '../controller/contestController.js';
const contestRouter = express.Router();

contestRouter.route('/').get(getAllContests)
contestRouter.route('/codeforces').get(codeforcesContests)
contestRouter.route('/gfg').get(gfgContests)


export default contestRouter;