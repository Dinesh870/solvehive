import { scrapeData } from "../scrapers/gfgScraper.js";
import { isLoggedOut } from "../utils/utils.js"
import { fetchCodeforcesUpcomingContest } from "../scrapers/fetchCodeforceData.js";
import ExpressError from "../utils/error.js";

// Display contests list
export const getAllContests = (req, res) => {
  const isTrue = isLoggedOut(req,res);
  res.render("contests/contest.ejs", { isTrue });
};

export const codeforcesContests = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  try {
    const upcomingContests = await fetchCodeforcesUpcomingContest();
    if (!upcomingContests) {
      return next(new ExpressError(500, "Server Error"));
    }
    res
      .status(200)
      .render("contests/showUpcomingContest.ejs", {
        upcomingContests,
        isTrue,
      });
  } catch (error) {
    next(error);
  }
};

// GEEKS FOR GEEKS
export const gfgContests = async (req, res, next) => {
  const isTrue = isLoggedOut(req, res);
  try {
    const scraped_data = await scrapeData();
    res
      .status(200)
      .render("contests/showContestData.ejs", {
        upcomingContests: scraped_data,
        isTrue,
      });
  } catch (error) {
    next(error);
  }
};
