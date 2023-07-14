function sleep(ms, callback) {
    setTimeout(function() {
        callback("finish " + ms) //执行完之后，返回‘finish’。
    }, ms);
}
sleep(1000, function(val) {
    console.log(val);
    sleep(2000, function(val) {
        console.log(val);
        sleep(3000, function(val) {
            console.log(val);
        });
    });
});