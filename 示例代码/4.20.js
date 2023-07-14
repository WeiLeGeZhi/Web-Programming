var express = require('express');
var app = express();
app.use('/public', express.static('public'));
app.get('/index', function(req, res) {
    res.sendFile(__dirname + "/public/" + "4.20.html");
})
app.get('/process_get', function(req, res) {
    // 输出 JSON 格式
    var response = {
        "title": req.query.title,
        "author": req.query.author
    };
    console.log(response);
    res.end(JSON.stringify(response));
})
var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("访问地址为 http://%s:%s", host, port)
})