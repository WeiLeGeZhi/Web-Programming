function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('finish ' + ms);
        }, ms);
    })
};

async function asyncSleep() {
    try {
        let value
            //用await来修饰函数
        value = await sleep(1000);
        console.log(value);
        value = await sleep(2000);
        console.log(value);
        value = await sleep(3000);
        console.log(value);
    } catch (error) {
        console.log(error);
    }
}
// //调用函数
asyncSleep();