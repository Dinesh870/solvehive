import puppeteer from "puppeteer";


export async function scrapeData() {
    const url = 'https://www.geeksforgeeks.org/events?itm_source=geeksforgeeks&itm_medium=main_header&itm_campaign=contests'; // Replace with your target URL
    const browser = await puppeteer.launch({ headless: true }); // Launch headless browser
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until network is idle

    // Extract data from the page
    const data = await page.evaluate(() => {
        // Select the container element
        const container = document.querySelector('div.ui.stackable.three.column.grid');

        // Check if container is found
        if (!container) {
            return { error: 'Container not found' };
        }

        // Extract some data for debugging
        const html = container.innerHTML; // Get the inner HTML of the container
        
        // parsing the data
        const parseDiv = document.createElement('div');
        parseDiv.innerHTML = html;

        const items = parseDiv.querySelectorAll('#eventsLanding_eachEventContainer__O5VyK');
        
        const formatDate = (datestr) => {
            const newDate = new Date(datestr);
            if(isNaN(newDate.getTime())) return null; // invalid date
            return newDate;
        }

        const computedRelativeTime = (date) => {
            if(!date) return 'invalid date';
            const nowDate = new Date();
            return nowDate - date;
        }
        const trackContestStatus = (relativetime) => {
            const duration = relativetime + 2*60*60*1000;
            if(duration < 0) return 'UPCOMING';
            if(duration < 0) return 'ONGOING';
            return 'COMPLETED';
        }

        return Array.from(items).map((item) => {
            const startDateStr = item.querySelector('.eventsLanding_eventDateContainer__Z1zke>p')?.innerText.trim() || 'No date';
            const startDate = formatDate(startDateStr);
            let relativeTime = computedRelativeTime(startDate);
            const status = trackContestStatus(relativeTime);

            return {
            platform: 'GEEKSFORGEEKS',
            contestname: item.querySelector('.eventsLanding_eventCardTitle__byiHw')?.innerText.trim() || 'No title',
            url: item.querySelector('a')?.href || '#',
            startDate: startDateStr,
            time: item.querySelector('.g-opacity-50')?.innerText || 'No time',
            relativeTime: relativeTime,
            status: status
    }})
    });

    // Log the extracted data to Node.js console
    await browser.close();
    // console.log('Extracted Data:', data);
    return data;
}

/** COMPLETED */
// const problemOfTheDayScrapper = async () => {
//     const url = "https://www.geeksforgeeks.org/problem-of-the-day";

//     const browser = await puppeteer.launch({ headless: true }); // Launch headless browser
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     const data = await page.evaluate(()=>{
//         const container = document.querySelector('.problemOfTheDay_problemContainer__BmMDm');
//         if(!container) {
//             return {error: "not found"}
//         }
//         const html = container.innerHTML; // Get the inner HTML of the container
//         const problemName = container.querySelector('.problemOfTheDay_problemContainerTxt__pPZ3Z').textContent;
//         const problem_address = container.querySelector('div a').href;
        
//         return {
//             platform: 'GeeksforGeeks',
//             problemName: problemName,
//             href: problem_address
//         }
//     });
// }

// problemOfTheDayScrapper()

/** TODO */
// const leetcodePOTD = async () => {
//     const url = "https://leetcode.com/problemset/";

//     const browser = await puppeteer.launch({ headless: true }); // Launch headless browser
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Ensure content is fully loaded
//     try {
//         // Increase timeout and wait for a specific element to ensure content is loaded
//         await page.waitForSelector('div[role="row"]', { timeout: 60000 });
//     } catch (error) {
//         console.error('Error waiting for selector:', error);
//          // Capture a screenshot for debugging
//          await page.screenshot({ path: 'debug-screenshot.png' });
//          // Print page content for debugging
//          const pageContent = await page.content();
//          console.log(pageContent);
//         await browser.close();
//         return;
//     }

//     // Debug: Take a screenshot to verify the page content
//     // await page.screenshot({ path: 'debug-screenshot.png' });
    
//     const data = await page.evaluate(()=>{
//         const container = document.querySelectorAll('div[role="row"]');
//         if(container.length == 0) {
//             return {error: "not found"}
//         }
//         let result = [];
//         container.forEach(e=>{
//             const textContent = e.innerHTML;
//             result.push(textContent);
//         });
//         return {data: result}
//     });
//     await browser.close();
//     console.log(data);
// }
// leetcodePOTD();

