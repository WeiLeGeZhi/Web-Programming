const path = require('path');
var express = require('express');
var app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.use('/source.interface', function(req, res, next) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.send('data:' + new Date() + '\n\n'); //后面必须带有'\n\n'，否则不会触发
});

app.listen(80);