'use strict';

// 引入4.2.js模块:
var hello = require('./4.2');

var s = 'JS';
var a = 1,
    b = 2;
hello.greet(s); // Hello, JS!
hello.sum(a, b);

// if (typeof(window) === 'undefined') {
//     console.log('node.js');
// } else {
//     console.log('browser');
// }