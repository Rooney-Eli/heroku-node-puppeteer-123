const puppeteer = require('puppeteer')

const overwatchBot = async (playerName) => {
    const browser = await puppeteer.launch({
        headless:true,
        args: ['--no-sandbox']
    })

    const page = await browser.newPage()

    await page.setViewport({width: 999, height: 300})
    await page.goto(`https://playoverwatch.com/en-us/career/pc/${playerName}/`)
    await page.waitForNetworkIdle({idleTime: 1})

    const ranks = await page.evaluate(() => {
        const roleRanks = Array.from(document.querySelectorAll('#overview-section > div > div.u-max-width-container.row.content-box.gutter-18 > div > div > div.masthead-player > div > div.competitive-rank > div.competitive-rank-role'))

        return roleRanks.map((roleRank) => {
            return {
                role: roleRank.querySelector('div:nth-child(2) > div.competitive-rank-tier.competitive-rank-tier-tooltip > span').innerText.split(" ")[0].toLowerCase(),
                rank: parseInt(roleRank.querySelector('div:nth-child(2) > div.competitive-rank-level').innerText)
            }
        })
    })

    await browser.close()

    console.log(`SERVICE: Bot finished scraping data for ${playerName}`)


    return { ranks: ranks }
}

module.exports = overwatchBot