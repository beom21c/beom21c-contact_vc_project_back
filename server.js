var express = require('express');
var server = express();

server.get('/cities.json', function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({insecticons : ["San Francisco","Amsterdam", "Berlin", "New York"]}));
    res.end();
});

server.get('/gukwha', function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({insecticons : ["으악!!!!!!!!!!!!!!!!"]}));
    res.end();
});

var port = process.env.PORT || 4000;
server.listen(port);

module.exports = server;