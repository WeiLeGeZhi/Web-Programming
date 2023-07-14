function 摇色子() {
    return new Promise((resolve, reject) => {
        let sino = parseInt(Math.random() * 6 + 1)
        setTimeout(() => {
            resolve(sino)
        }, 3000)
    })
}
async function test() {
    let n = await 摇色子()
    console.log(n)
}
test()