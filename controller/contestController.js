import { scrapeData } from '../scrapers/gfgScraper.js';

// Display contests list
export const getAllContests = (req, res) => res.render('contests/contest.ejs');

export const codeforcesContests = async (req, res)=> {
    try {
        const upcomingContests = await fetchCodeforcesUpcomingContest();
        // console.log(upcomingContests)
        if(!upcomingContests) {
            res.status(500).send("server error");
        }
        res.status(200).render("contests/showUpcomingContest.ejs", {upcomingContests});
    } catch (error) {
        console.log(error);
    }
}

// function to fetch data from codeforces
async function fetchCodeforcesUpcomingContest() {
    try{
        const response = await fetch("https://codeforces.com/api/contest.list");
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if(data.status === 'OK') {
            const allContests = data.result;
            const upcomingContests = allContests.filter(contest=> contest.phase === 'BEFORE');
            // sorting the upcomingContest array in increasing order
            upcomingContests.sort((a,b)=>(a.startTimeSeconds - b.startTimeSeconds));
            return upcomingContests;
        } else {
            console.log("failed to fetch data");
            return [];
        }
    } catch(error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// GEEKS FOR GEEKS
export const gfgContests = async (req,res) => {
    try {
        const scraped_data = await scrapeData();
        // console.log(scraped_data);
        res.status(200).render("contests/showContestData.ejs", {upcomingContests :scraped_data});
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
}
