var express = require("express")

var port = process.env.port ? process.env.port : 9000

var https = require("https")

var app = express()

app.use(function logTime(req, res, next) {
    console.log('Request at: ', Date.now(), req.method, req.url, req.query)
    next();
})


app.use(express.static("./scripts"))
app.use(express.static("./"))

app.get("/test",(req, res) =>{
    res.send("Got the test.")
})

app.get("/user", (req, res) => {
    console.log("Request for user: ", req.isAuthenticated(), req.user || "{empty}")
    if(req.isAuthenticated() && req.user)
        res.send(req.user)
    else
        res.send({})
})

app.get("/version",(req, res) => {
    res.send("Version: " + nconf.get("APP_VERSION"))
})

app.get("*", (req, res, next) => {
    if(req.isAuthenticated()) next()
    else res.redirect("/index.html")
})

app.listen(port, () => {
    console.log("Listening at " + port)
})

