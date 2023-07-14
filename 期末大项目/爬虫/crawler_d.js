// 新闻来源
let source_name = "中国日报";
// 编码格式
let myEncoding = "utf-8";
// 主页URL
let seedURL = 'https://www.chinadaily.com.cn/';
let myURL = "";
// Jquery全局对象
let seedURL_format = "$('*')";
// 正则表达式
let url_reg = /a\/\d{6}/;

// 导入所需模块
let fs = require('fs');    // 文件库, 最后的新闻对象存入JSON文件中
let myRequest = require('request'); // 对网站发出请求
let myCheerio = require('cheerio'); // 对请求得到的html代码进行解析为Jquery对象
let https = require('https');  // 对网站发出https请求
let myIconv = require('iconv-lite');// 对网站进行uft8编码
let superagent = require('superagent'); // 根据url得到网站的html代码
let schedule = require('node-schedule');//定时执行
let mysql = require('mysql');// 数据库
require('date-utils');    // 日期操作
let rule = new schedule.RecurrenceRule();
rule.second =20;
//建立与数据库之间的连接
let crawler = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Lorenzo33Peter36',
    database:'news'
});

crawler.connect();

// 防止网站屏蔽我们的爬虫, 详细见下方headers
let headers = {
    'user-agent': "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36"
};

// request模块异步fetch url
function request(url, callback) {
    let options = {
        url: url,
        encoding: null,
        headers: headers,
        // 响应时间
        timeout: 10000
    }
    myRequest(options, callback);
}

schedule.scheduleJob(rule,function () {
    request(seedURL, function(err, res, body) {
        // 回调函数 err为错误信息, 无错误则为null, res为回调函数得到的结果
        // 用iconv转换编码, 存入html中
        let html = myIconv.decode(body, myEncoding);
        // 对得到的html代码进行解析
        let $ = myCheerio.load(html, {decodeEntities: true});
        let seedurl_news;
        try {
            seedurl_news = eval(seedURL_format);
        } catch(e) {console.log('url列表所处的html模块识别出错' + e)};
        seedurl_news.each(function(i, e) {
            try {
                // 提取出网站的所有href链接并做判断, 无则跳过到下一次循环
                let href = "";
                href = $(e).attr("href");
                if (typeof href == "undefined") {
                    return;
                }
                myURL = href;
                // 对得到的链接进行规整
                if (href.toLowerCase().indexOf('https://') >= 0 || href.toLowerCase().indexOf('http://') >= 0) {
                    console.log('case 1');
                    myURL = href;
                    console.log(href);
                }
                else if (href.startsWith('//')) {
                    console.log('case 2');
                    myURL = 'https:' + href;
                    console.log(href);
                }
                else
                {
                    console.log('case 3')
                    myURL = seedURL.substr(0, seedURL.lastIndexOf('/') + 1) + href;
                    console.log(href);
                }
            }  catch (e) {console.log('识别种子页面中的新闻链接出错：' + e)}
            // 用正则表达式对链接进行筛选, 符合条件的, 即新闻页面, 则进行处理.
            if (!url_reg.test(myURL)) return;
            newsGet(myURL);
        })
    });
})

function newsGet(myURL) {       // 读取新闻页面
    // superagent.get方法会根据url得到网站的所有html代码, 存储在end时间的res参数中.
    superagent.get(myURL).end((err, res) => {
        // err中存储错误, res中为html代码
        if (err) {
            console.log(myURL);
            console.log("热点新闻抓取失败-${err}");
        } else {
            console.log("爬取新闻成功!");
            getHotNews(res, myURL);
        }
    })
}

// 提取html代码中所需信息存入fetch对象中并存入数据库
function getHotNews(res, myURL) {
    let $ = myCheerio.load(res.text, { decodeEntities: true });
    // fetch为单条新闻对象. 详细见fetches解释
    let fetch = {};
    fetch.title = "";//标题
    fetch.content = "";//内容
    fetch.keywords = "";//关键词
    fetch.publish_date = "";//文章发表日期
    fetch.author = "";//作者
    fetch.desc = "";//摘要
    fetch.source_name = source_name;//来源
    fetch.source_encoding = myEncoding;//utf-8
    fetch.crawltime = new Date;//爬取日期
    fetch.url = myURL;//url

    fetch.title = $('title').eq(0).text();
    if (fetch.title == "") fetch.title = source_name;
    const Content = $('div[id="Content"]');
    const paragraphs = Content.find('p');
    paragraphs.each((index,element)=>{
        fetch.content=fetch.content+$(element).text();
    });// 输出 <p> 标签中的文本内容


    fetch.keywords = $('meta[name=\"keywords\"]').eq(0).attr("content");
    fetch.publish_date = $('meta[name=\"publishdate\"]').eq(0).attr("content");
    fetch.author = $('meta[name=\"author\"]').attr("content")
    fetch.desc = $('meta[name=\"description\"]').eq(0).attr("content");
    if ((fetch.title!=undefined)&(fetch.content!=undefined)&(fetch.keywords!=undefined)&(fetch.publish_date!=undefined)&(fetch.author!=undefined)&(fetch.desc!=undefined))
    {
        if((fetch.title.length!=0)&(fetch.content.length!=0)&(fetch.keywords.length!=0)&(fetch.publish_date.length!=0)&(fetch.author.length!=0)&(fetch.desc.length!=0))
        {
            crawler.query('INSERT IGNORE INTO newsinfo(title,content,keywords,publish_date,author,description,source_name,source_encoding,crawltime,url) VALUES (?,?,?,?,?,?,?,?,?,?)',[fetch.title,fetch.content,fetch.keywords,fetch.publish_date,fetch.author,fetch.desc,fetch.source_name,fetch.source_encoding,fetch.crawltime,fetch.url],function (error,results,fields) {
                if(error)
                {
                    throw error;
                }
                console.log("成功写入数据库！")
            });
        }
        else
        {
            console.log("不合要求！");
            return;
        }
    }
    else
    {
        console.log("不合要求！");
        return;
    }
};
