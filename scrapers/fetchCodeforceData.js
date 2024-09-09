// function to fetch data from codeforces
export async function fetchCodeforcesUpcomingContest() {
    try {
      const response = await fetch("https://codeforces.com/api/contest.list");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "OK") {
        const allContests = data.result;
        const upcomingContests = allContests.filter(
          (contest) => contest.phase === "BEFORE"
        );
        // sorting the upcomingContest array in increasing order
        upcomingContests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
        return upcomingContests;
      } else {
        console.log("failed to fetch data");
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }