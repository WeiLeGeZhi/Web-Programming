var http = require('http'); //引入http包
var url = require('url'); //引入url包
var util = require('util'); //引入util包
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); //发送响应头
    res.end(util.inspect(url.parse(req.url, true))); //发送响应数据，结束响应
}).listen(3000);