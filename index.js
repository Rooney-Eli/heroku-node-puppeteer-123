const express = require("express")
const bot =  require("./bot.js")
const app = express()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

app.get("/api/", (req, res) => {
    console.log("ENDPOINT: /api got a GET")
    res.send("Hello from api!")
})

app.get("/api/scrape", async (req, res) => {
    const response = await bot()
    res.send(response)
})