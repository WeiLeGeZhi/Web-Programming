var http = require('http');
var url = require('url');

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); //charset必须，不然会有乱码
    var params = url.parse(req.url, true).query; // 解析 url 参数
    res.write("网站名：" + params.name);
    res.write("\n");
    res.write("网站 URL：" + params.url);
    res.end();
}).listen(3000); //将上述代码另存为2.js，在命令行中运行node 2.js