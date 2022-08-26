const overwatchBot = async (playerName, browser) => {
    const page = await browser.newPage()
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

    console.log(`SERVICE: overwatchBot finished scraping data for ${playerName}`)

    return { ranks: ranks }
}

module.exports = overwatchBot