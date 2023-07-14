var fs = require("fs");
console.time('test');
var data1 = fs.readFileSync('1.txt');
console.log("1.txt OK!");
var data2 = fs.readFileSync('2.txt');
console.log("2.txt OK!");
var data3 = fs.readFileSync('3.txt');
console.log("3.txt OK!");
console.timeEnd('test');