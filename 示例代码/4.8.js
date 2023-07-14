var fs = require("fs");
var events = require('events');
var emitter = new events.EventEmitter();
fs.readFile('1.txt', function(err, data) {
    if (err) return console.error(err);
    emitter.emit('done', '1.txt ok! done');

});
fs.readFile('2.txt', function(err, data) {
    if (err) return console.error(err);
    emitter.emit('done', '2.txt ok! done');

});
fs.readFile('3.txt', function(err, data) {
    if (err) return console.error(err);
    emitter.emit('done', '3.txt ok! done');
});

emitter.on('done', function(val) {
    console.log(val);
});