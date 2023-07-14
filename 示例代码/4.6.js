var fs = require("fs");
console.time('test');
fs.readFile('1.txt', function(err, data) {
    if (err) return console.error(err);
    console.log("1.txt OK!");

});
fs.readFile('2.txt', function(err, data) {
    if (err) return console.error(err);
    console.log("2.txt OK!");

});

fs.readFile('3.txt', function(err, data) {
    if (err) return console.error(err);
    console.log("3.txt OK!");
});
console.timeEnd('test');