import puppeteer from 'puppeteer';

async function scrapeData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    try {
        // Take a screenshot for debugging
        // await page.screenshot({ path: 'screenshot.png', fullPage: true });

        // Check if the page has fully loaded and print the page content
        const pageContent = await page.content();
        // console.log('Page content:', pageContent.slice(0, 1000)); // Print the first 1000 characters

        // Wait for a more generic selector and try to debug
        await page.waitForSelector('body', { timeout: 60000 });

        const data = await page.evaluate(() => {
            // Try logging the entire HTML of the body to see the structure
            console.log(document.body.innerHTML);

            const container = document.querySelector('.swiper-wrapper');
            if (!container) {
                throw new Error('Element not found');
            }

            return Array.from(
                container.querySelectorAll('div.bg-layer-1')
            ).map(el => el.textContent.trim());
        });

        console.log('Data:', data);
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        await browser.close();
    }
}

// Example usage
scrapeData('https://leetcode.com/contest/');
