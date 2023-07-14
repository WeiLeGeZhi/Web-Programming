var s = 'Hello';

function greet(name) {
    console.log(s + ', ' + name + '!');
}

// module.exports = greet;
function sum(a, b) {
    console.log('a = ' + a + ', b = ' + b);
    console.log('a + b = ' + (a + b));
}

//每个模块只能输出一个对象 
module.exports = { greet: greet, sum: sum };

//console.log(greet('wwy'));