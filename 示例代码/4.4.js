// 引入4.2.js模块:
var hello = require('./package1');

var s = 'JS';
var a = 1,
    b = 2;
hello.greet(s); // Hello, JS!
hello.sum(a, b);