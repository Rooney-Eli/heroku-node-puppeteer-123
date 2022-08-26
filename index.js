const express = require("express")
const cheerio = require("cheerio")
const puppeteer = require('puppeteer')
const axios = require("axios")
const overwatchBot =  require("./overwatch-bot.js")
const haloBot =  require("./halo-bot.js")
const app = express()

const port = process.env.PORT || 3000

let browser

app.listen(port, () => {
    console.log(`SERVER: Listening on port ${port}...`)
})

process.on('SIGTERM', () => {
    console.log("SERVER: SIGTERM received: Shutting down...")
    if(browser) {
        browser.close()
    }
    console.log("SERVER: Shutdown completed.")
})

app.get("/api/scrape/ow/lastPlayed/:name", async (req, res) => {
    const playerName = req.params.name

    // Battle tags require 3-12 characters, special characters and numbers are allowed. It cannot start with number.
    const regex = RegExp("^[A-zÀ-ú]+[A-zÀ-ú0-9]{2,11}-[0-9]+$")

    if(!regex.test(playerName)) {
        res.sendStatus(400)
        return
    }

    console.log(`CONTROLLER: /api/scrape/ow/lastPlayed/${playerName} got a GET`)
    try {
        const lastPlayedEpochSelector = 'body > div.skin-container.seemsgood > div.container.main > div > div > div.layout-header > div:nth-child(1) > div:nth-child(1) > div > div.layout-header-primary-bio > div:nth-child(2) > span'
        const url = `https://www.overbuff.com/players/pc/${playerName}?mode=competitive`
        const html = await axios.get(url)
        const response = html.data
        const $ = await cheerio.load(response);

        const lastPlayedEpoch = await $(lastPlayedEpochSelector).attr('data-time')

        console.log(`CONTROLLER: /api/scrape/ow/lastPlayed/${playerName} responding with ${lastPlayedEpoch}`)

        res.send(lastPlayedEpoch)

    } catch (e) {
        console.log(`ERROR: CONTROLLER: /api/scrape/ow/lastPlayed/${playerName}` )
        res.sendStatus(500)
    }

})

app.get("/api/scrape/ow/ranks/:name", async (req, res) => {
    const playerName = req.params.name

    // Battle tags require 3-12 characters, special characters and numbers are allowed. It cannot start with number.
    const regex = RegExp("^[A-zÀ-ú]+[A-zÀ-ú0-9]{2,11}-[0-9]+$")

    if(!regex.test(playerName)) {
        res.sendStatus(400)
        return
    }

    console.log(`CONTROLLER: /api/scrape/ow/ranks/${playerName} get a GET. `)

    try {
        if(!browser) {
            browser = await puppeteer.launch({
                headless:true,
                args: ['--no-sandbox']
            })
        }

        const ranks = await overwatchBot(playerName, browser)

        //const maxRank = ranks.reduce((a, b) => { return Math.max(a, b.rank) })

        console.log(`CONTROLLER: /api/scrape/ow/ranks/${playerName} responding with ${JSON.stringify(ranks)}`)

        res.send(ranks)
    } catch (e) {
        console.log(`ERROR: CONTROLLER: /api/scrape/ow/ranks/${playerName}` )
        res.sendStatus(500)
    }

})

app.get("/api/scrape/halo/ranks/:name", async (req, res) => {
    const playerName = req.params.name

    console.log(`CONTROLLER: /api/scrape/halo/ranks/${playerName} get a GET. `)

    try {

        if(!browser) {
            console.log("SERVER: Starting puppeteer browser instance...")
            browser = await puppeteer.launch({
                headless:true,
                args: [
                    '--no-sandbox'
                ]
            })
            console.log("SERVER: Started puppeteer browser instance.")
        }

        const playerData = await haloBot(playerName, browser)

        console.log(`CONTROLLER: /api/scrape/halo/ranks/${playerName} responding with ${JSON.stringify(playerData)}`)

        res.send(playerData)
    } catch (e) {
        console.log(e.message)
        console.log(`ERROR: CONTROLLER: /api/scrape/halo/ranks/${playerName}` )
        res.sendStatus(500)
    }

})