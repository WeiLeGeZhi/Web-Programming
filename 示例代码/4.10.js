function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('finish ' + ms);
        }, ms);
    })
}
sleep(1000).then(value => {
    console.log(value)
    return sleep(2000)
}).then(value => {
    console.log(value)
    return sleep(3000)
}).then(value => {
    console.log(value)
    return sleep(4000)
})