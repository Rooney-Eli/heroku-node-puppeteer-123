const puppeteer = require('puppeteer')

const bot = async () => {

    const browser = await puppeteer.launch({
        headless:true,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    await page.setContent(`<p>web running at ${Date()}</p>`)
    const content = await page.content()
    await browser.close()
    return content

}

module.exports = bot