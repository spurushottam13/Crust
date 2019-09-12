var crustRevolve = require('./crust.js');

console.log("ServerR - running ", new Date().getTime())

var http = require('http')
var server = http.createServer(function(req,res){
    console.log("request made ",req.url)
    res.writeHead(200,{'Content-type':'text/plain'})
    res.end("Hey ")
})

server.listen(process.env.PORT || 5000)

setInterval(function() {
    console.log("Requesting again")
    https.get('https://crust-sp13.herokuapp.com/')
}, 300000);

crustRevolve();

