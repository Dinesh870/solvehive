import puppeteer from "puppeteer";

const url = 'https://www.geeksforgeeks.org/events?itm_source=geeksforgeeks&itm_medium=main_header&itm_campaign=contests'; // Replace with your target URL

export async function scrapeData() {
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

// scrapeData();
