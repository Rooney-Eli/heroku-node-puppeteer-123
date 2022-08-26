const haloBot = async (playerName, browser) => {

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
    const rating = await getRating(playerName, page)
    await page.close()

    const page2 = await browser.newPage()
    await page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
    const lastPlayed = await getLastPlayed(playerName, page2)
    await page2.close()

    console.log(`SERVICE: haloBot finished scraping data for ${playerName}`)

    return {
        rating: rating,
        lastPlayed: lastPlayed
    }
}

async function getRating(playerName, page) {
    console.log(`SERVICE: Getting Rating for ${playerName}...`)

    const overviewURL = `https://halotracker.com/halo-infinite/profile/xbl/${ encodeURIComponent(playerName) }/overview?experience=ranked`
    const ratingSelector = '#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid__sidebar-left > div:nth-child(1) > div.rating > div > div.rating-content.rating-content--secondary > div:nth-child(1) > div > div:nth-child(1) > div.flex-row > div.rating-entry__rank-info > div.value > span'

    await page.goto(overviewURL)
    await page.waitForSelector(ratingSelector)

    const currentCrossplayRating = await page.evaluate( () => {
        const ratingSelector = '#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid__sidebar-left > div:nth-child(1) > div.rating > div > div.rating-content.rating-content--secondary > div:nth-child(1) > div > div:nth-child(1) > div.flex-row > div.rating-entry__rank-info > div.value > span'
        const ratingSelected = document.querySelector(ratingSelector).innerText
        return parseInt(ratingSelected.replace(',', ''))
    })

    console.log(`SERVICE: Got Rating for ${playerName}: ${currentCrossplayRating}`)

    return currentCrossplayRating
}


async function getLastPlayed(playerName, page) {
    console.log(`SERVICE: Getting LastPlayed for ${playerName}...`)

    const matchesURL = `https://halotracker.com/halo-infinite/profile/xbl/${ encodeURIComponent(playerName) }/overview?experience=ranked`
    const dateSelector = '#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid__sidebar-left > div:nth-child(2) > div:nth-child(3) > div > div.trn-gamereport-list.trn-gamereport-list--compact > div:nth-child(1) > div.trn-gamereport-list__group-title > div > div.session-header__metadata > div > div.session-header__title'

    await page.goto(matchesURL)
    await page.waitForSelector(dateSelector)

    const lastPlayed = await page.evaluate(() => {
        const dateSelector = '#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid__sidebar-left > div:nth-child(2) > div:nth-child(3) > div > div.trn-gamereport-list.trn-gamereport-list--compact > div:nth-child(1) > div.trn-gamereport-list__group-title > div > div.session-header__metadata > div > div.session-header__title'
        const divSelected = document.querySelector(dateSelector).innerHTML
        const selectedDate = divSelected.split(' <span')[0]

        if(selectedDate === 'Today') {
            const today = new Date()

            return `${ today.toLocaleString('default', { month: 'short', day: 'numeric'}) }`
        }
        return selectedDate
    })

    console.log(`SERVICE: Got LastPlayed for ${playerName}: ${lastPlayed}`)

    return lastPlayed
}

module.exports = haloBot