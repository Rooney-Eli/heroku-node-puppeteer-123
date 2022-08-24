const puppeteer = require('puppeteer')

const bot = async () => {

    const browser = await puppeteer.launch({
        headless:true,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    await page.goto("https://playoverwatch.com/en-us/career/pc/Zeno-11154/")
    await page.waitForNetworkIdle({idleTime: 1})


    const x = await page.evaluate(() => {
        const roleRanks = Array.from(document.querySelectorAll('#overview-section > div > div.u-max-width-container.row.content-box.gutter-18 > div > div > div.masthead-player > div > div.competitive-rank > div.competitive-rank-role'))

        //order of the role ranks will not be consistent. use the 1nth child to determine which role is currently being parsed
        return roleRanks.map((roleRank) => {
            return roleRank.querySelector('div:nth-child(2) > div.competitive-rank-level').innerText
        })
    })

    await browser.close()
    return x

}

module.exports = bot