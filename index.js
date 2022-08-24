const express = require("express")

const app = express()

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

app.get("/api/", (req, res) => {
    console.log("ENDPOINT: /api got a GET")
    res.send("Hello from api!")
})

app.get("/api/hello", (req, res) => {
    console.log("ENDPOINT: /api/hello got a GET")
    res.send("Hello from api/hello!")
})