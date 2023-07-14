console.log('你好世界');
// 打印到 stdout: 你好世界
console.log('你好%s', '世界');
// 打印到 stdout: 你好世界
console.error(new Error('错误信息'));
// 打印到 stderr: [Error: 错误信息]

const name = '描述';
console.warn('警告${name}');
// 打印到 stderr: 警告描述