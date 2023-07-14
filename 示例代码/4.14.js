var fs = require("fs");

function my_writeFile(path, text) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, () => resolve("数据写入成功！"));
    })
};

function my_readFile(path) {
    return new Promise((resolve, reject) => {
        console.log("--------我是分割线-------------");
        console.log("读取数据：");
        fs.readFile(path, 'utf-8', (err, data) => resolve(data));
    });
}
async function test() {
    let n = await my_writeFile('write.txt', '测试读写文件！');
    console.log(n);
    n = await my_readFile('./write.txt');
    console.log(n);
}
test()