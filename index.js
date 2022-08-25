const express = require("express")
const cheerio = require("cheerio")
const axios = require("axios")
const overwatchBot =  require("./overwatch-bot.js")
const app = express()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

app.get("/api/scrape/ow/lastPlayed/:name", async (req, res) => {
    const playerName = req.params.name

    // Battle tags require 3-12 characters, special characters and numbers are allowed. It cannot start with number.
    const regex = RegExp("^[A-zÀ-ú]+[A-zÀ-ú0-9]{2,11}-[0-9]+$")

    if(!regex.test(playerName)) {
        res.sendStatus(400)
        return
    }

    console.log(`ENDPOINT: /api/scrape/ow/lastPlayed/${playerName} got a GET`)

    const lastPlayedEpochSelector = 'body > div.skin-container.seemsgood > div.container.main > div > div > div.layout-header > div:nth-child(1) > div:nth-child(1) > div > div.layout-header-primary-bio > div:nth-child(2) > span'
    const url = `https://www.overbuff.com/players/pc/${playerName}?mode=competitive`
    const html = await axios.get(url)
    const response = html.data
    const $ = await cheerio.load(response);

    const lastPlayedEpoch = await $(lastPlayedEpochSelector).attr('data-time')

    console.log(`ENDPOINT: /api/scrape/ow/lastPlayed/${playerName} responding with ${lastPlayedEpoch}`)

    res.send(lastPlayedEpoch)
})

app.get("/api/scrape/ow/ranks/:name", async (req, res) => {
    const playerName = req.params.name

    // Battle tags require 3-12 characters, special characters and numbers are allowed. It cannot start with number.
    const regex = RegExp("^[A-zÀ-ú]+[A-zÀ-ú0-9]{2,11}-[0-9]+$")

    if(!regex.test(playerName)) {
        res.sendStatus(400)
        return
    }

    console.log(`ENDPOINT: /api/scrape/ow/ranks/${playerName} get a GET. `)

    try {
        const ranks = await overwatchBot(playerName)

        //const maxRank = ranks.reduce((a, b) => { return Math.max(a, b.rank) })

        console.log(`ENDPOINT: /api/scrape/ow/ranks/${playerName} responding with ${JSON.stringify(ranks)}`)

        res.send(ranks)
    }
    catch (e) {
        res.sendStatus(500)
    }
})