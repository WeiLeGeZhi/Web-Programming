var myRequest = require('request')
var myCheerio = require('cheerio')
var schedule = require('node-schedule')
var myIconv = require('iconv-lite')
var fs = require('fs')
var mysql = require('mysql');
require('date-utils');
var myURL = 'https://www.ecnu.edu.cn/info/1094/63197.htm'
function request(url, callback) {//request module fetching url
    var options = {
        url: url,  encoding: null, headers: null
    }
    myRequest(options, callback)
}
request(myURL, function (err, res, body) {
    var html = body;
    var $ = myCheerio.load(html, { decodeEntities: false });
    //console.log($.html());
    console.log("title: " + $('title').text());
    console.log("description: " + $('meta[name="description"]').eq(1).attr("content"));
    
})   
