# Web-Programming
WEN Zhaohe's repository for the course Web Programming
## Chapters
- 课程概述
- HTML语言和HTML样式
- JavaScript基本概念
- 客户端JavaScript
- 服务器端JavaScript
- JavaScript前端框架和工具
## 项目入口
### 启动爬虫
- 《中国日报》
```shell
cd ../期末大项目/爬虫
node crawler_d.js
```
- 《人民日报海外版》
```shell
cd ../期末大项目/爬虫
node crawler_p.js
```
### 启动网页
```shell
cd ../期末大项目/网页
node bin/www
```
<strong>注意：启动网站时可能需要使用VPN，否则可能无法显示图表。</strong>
## 期末大项目开发日志
### 2023.07.03
项目进度：
- 完成新闻爬虫部分，使得爬取的结果被写入文件。
### 2023.07.04
项目进度：
- 完成新闻爬虫部分，使得爬取的结果被写入数据库。

解决的问题：
- 无法把utf-8编码的文字写入数据库：在MySQL的命令行中用类似`alter table newsinfo modify title varchar(255) character set utf8;`的语句修改表格的每一列
- 新闻的内容分散在`<div id = Content>`下的多个`<p>`中，无法被一次性读取：助教提供的解决方法：
```js
const Content = $('div[id="Content"]');
    const paragraphs = Content.find('p');
    paragraphs.each((index,element)=>{
        fetch.content=fetch.content+$(element).text();
    });// 输出 <p> 标签中的文本内容
```
- 环球网中文页面反爬严重：改成爬China Daily。
- 无法爬到存储在`<meta name = author>`中的作者信息：把`$('meta[name=\"author\"]')`打印出来后发现作者姓名存储在一个叫`attribe`的地方的`content`下面，所以需要把代码修改为
```js
fetch.author = $('meta[name=\"author\"]').attr("content")
```
### 2023.07.05
项目进度：
- 继续调整原有爬虫，使得爬虫仅将没有空项的新闻数据存入数据库。
- 继续调整原有爬虫，使得爬虫仅将数据库中没有出现过的新闻数据存入数据库。
- 继续调整原有爬虫，使得爬虫能够定时自动爬取数据。
- 新增一个爬取人民日报英文版的爬虫代码。

解决的问题：
- 用示例代码中的
```js
let fetch_url_Sql = 'select url from fetches where url=?';
 let fetch_url_Sql_Params = [myURL];
 mysql.query(fetch_url_Sql, fetch_url_Sql_Params, function(qerr, vals, fields) {
     if (vals.length > 0) {
         console.log('URL duplicate!');
     }else newsGet(myURL);
})
```
无法把重复项筛选出去：把插入新闻数据的SQL代码从
```js
crawler.query('INSERT INTO newsinfo(title,content,keywords,publish_date,author,description,source_name,source_encoding,crawltime,url) VALUES (?,?,?,?,?,?,?,?,?,?)',[fetch.title,fetch.content,fetch.keywords,fetch.publish_date,fetch.author,fetch.desc,fetch.source_name,fetch.source_encoding,fetch.crawltime,fetch.url],function (error,results,fields) {
                if(error)
                {
                    throw error;
                }
                console.log("成功写入数据库！")
            });
```
改成
```js
crawler.query('INSERT IGNORE INTO newsinfo(title,content,keywords,publish_date,author,description,source_name,source_encoding,crawltime,url) VALUES (?,?,?,?,?,?,?,?,?,?)',[fetch.title,fetch.content,fetch.keywords,fetch.publish_date,fetch.author,fetch.desc,fetch.source_name,fetch.source_encoding,fetch.crawltime,fetch.url],function (error,results,fields) {
                if(error)
                {
                    throw error;
                }
                console.log("成功写入数据库！")
            });
```
### 2023.07.06
项目进度：
- 继续爬取新闻网页，构思前后端展示部分。
### 2023.07.07
项目进度：
- 实现最基础的查询功能：输入一个关键词，搜索出所有`keywords`中包含输入的关键词的新闻。
### 2023.07.08
项目进度：
- 在保留基础查询功能的前提下更改网页布局。
### 2023.07.09
项目进度：
- 在顶栏中显示当前查询的日期、媒体名称、关键词等。
- 新增根据媒体名称、发表日期搜索新闻的功能，并修改搜索框样式。
- 在新闻标题中新增前往该新闻所在网页的链接。

解决的问题：
- 后端无法获取表单中提交的日期：把代码改成
```js
  $.get('/date_get?date=' + $("input[type='date']").val(), function(data) {
  // ...
})
```
- 无法正确调整SQL查询结果中的RowDataPacket：删除`url`字段的操作需要使用`delete`关键字，而不是调用`delete`方法。如
```js
 for (let list of result) {
      list.title = `<a href="${list.url}">${list.title}</a>`;
      delete list.url;
    }
```
此外，还要根据希望某一条新闻在网页中显示的格式（标题+链接、媒体名称、日期）把SQL语句从
```sql
"SELECT url, source_name, title, author, crawltime " +
    "FROM newsinfo WHERE ..."
```
修改为
```sql
"SELECT url,title, source_name, publish_date " +
    "FROM newsinfo WHERE ..."
```
### 2023.07.10
项目进度：
- 在`nav`中增添柱状图进行媒体名称、发表日期、关键词等数据的可视化。
- 在`search.html`中新增一个函数，使得点击表格中某一列后，表格按照该列顺序或逆序显示。

解决的问题：

- 在`<div id="chart">`中显示了一张图表后无法清空并显示另一张：把`<div id="chart">`改成`<canvas id="chart">`，把所有在`<canvas id="chart">`中显示图表的函数放在同一个`<script type="module">`中，并把`var myChart;`定义为全局变量。
### 2023.07.11
项目进度：
- 在`nav`中增添当前媒体或者日期的关键词的词云图以及当前关键词的时间热度折线图。

解决的问题：

- 原有的`<script src="https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js"></script>`不足以支持展示词云图：参考`https://github.com/ecomfe/echarts-wordcloud`。
### 2023.07.12
项目进度：
- 修改“搜索媒体”和“搜索日期”下的柱状图内容。
- 柱状图按照`value`的值从上往下从大到小显示，时间热度折线图按照`category`的顺序从左往右从小到大显示。
- 新增“清除”按钮，删除搜索栏中保留的输入内容。
- 实现表格部分的分页显示。

解决的问题：

- 分页时给“搜索关键词”、“搜索媒体”和“搜索日期”分别定义不同的函数，导致实际分页时函数调用混乱：“搜索关键词”、“搜索媒体”和“搜索日期”分页时共用功能相同的函数，所有函数定义在同一个`<script>`中：
```js
<script>
        $(document).ready(function() {
            var currentPage = 1;
            var recordsPerPage = 16;
            var data;

            function displayData() {
                var startIndex = (currentPage - 1) * recordsPerPage;
                var endIndex = startIndex + recordsPerPage;
                var tableBody = $("#record2").find("tbody");
                tableBody.empty();

                for (var i = startIndex; i < endIndex && i < data.length; i++) {
                    var list = data[i];
                    var tableRow = $("<tr>").addClass("cardLayout");
                    Object.values(list).forEach(function(element, index) {
                        var tableData = $("<td>");
                        if (index === 0) { // 如果是标题字段
                            var link = document.createElement("a");
                            let titleAndUrl = element.split('%^&')
                            link.href = titleAndUrl[0];
                            link.textContent = titleAndUrl[1];
                            tableData.append(link);
                        } else {
                            tableData.text(element);
                        }
                        tableRow.append(tableData);
                    });

                    tableRow.appendTo(tableBody);
                }
            }

            function setupPagination() {
                var totalRecords = data.length;
                var totalPages = Math.ceil(totalRecords / recordsPerPage);
                var pagination = $(".pagination");
                pagination.empty();

                var prevLink = $("<a>").addClass("page-link").attr("href", "#").text("上一页");
                var nextLink = $("<a>").addClass("page-link").attr("href", "#").text("下一页");

                var prevItem = $("<li>").addClass("page-item");
                var nextItem = $("<li>").addClass("page-item");

                if (currentPage === 1) {
                    prevItem.addClass("disabled");
                } else {
                    prevLink.click(function(event) {
                        event.preventDefault();
                        setPage(currentPage - 1);
                    });
                }

                if (currentPage === totalPages) {
                    nextItem.addClass("disabled");
                } else {
                    nextLink.click(function(event) {
                        event.preventDefault();
                        setPage(currentPage + 1);
                    });
                }

                prevItem.append(prevLink).appendTo(pagination);

                for (var i = 1; i <= totalPages; i++) {
                    var pageItem = $("<li>").addClass("page-item");
                    var pageLink = $("<a>").addClass("page-link").attr("href", "#").text(i);

                    if (i === currentPage) {
                        pageItem.addClass("active");
                    }

                    pageItem.append(pageLink).appendTo(pagination);

                    pageLink.click(function(event) {
                        event.preventDefault();
                        var page = parseInt($(this).text());
                        setPage(page);
                    });
                }

                nextItem.append(nextLink).appendTo(pagination);
            }


            function setPage(page) {
                currentPage = page;
                displayData();
                setupPagination();
            }

            $('button[id="search"]').click(function() {
                $.get('/process_get?keyword=' + $("#keyword").val(), function(responseData) {
                    data = responseData;
                    setPage(1);
                });
            });

            $('button[id="date"]').click(function() {
                $.get('/date_get?date=' + $("input[type='date']").val(), function(responseData) {
                    data = responseData;
                    setPage(1);
                });
            });

            $('button[id="media"]').click(function() {
                $.get('/media_get?media=' + item, function(responseData) {
                    data = responseData;
                    setPage(1);
                });
            });

            $(".pagination").on("click", "a.page-link", function(event) {
                event.preventDefault();
                var page = parseInt($(this).text());
                setPage(page);
            });
        });
    </script>
```
### 2023.07.13
项目进度：
- 美化按钮样式
- 调整柱状图颜色
- 调整词云图形状
- 调整顶部、底部颜色

解决的问题：
- 人民日报海外版的关键词均为较长的短语，影响词云图视觉效果：把每个关键词用空格和逗号分开，然后将其中无意义的词（如代词、借此、冠词等）过滤掉：
```js
let meaninglessWords = [
  "I", "you", "he", "she", "it", "we", "they",
  "me", "you", "him", "her", "it", "us", "them",
  "my", "your", "his", "her", "its", "our", "their",
  "mine", "yours", "his", "hers", "ours", "theirs",
  "this", "that", "these", "those",
  "a", "an", "the",
  "in", "on", "at", "by", "with", "to", "from", "of", "for",
  "and", "but", "or", "nor", "so", "yet", "though",
  "oh", "wow", "alas", "ouch", "hurray", "oops", "hey", "ah", "oh"
];

function countStringsChart(arr) {
    ......
    for (var key in counts) {
        var word = key;
        var frequency = counts[key];
        if (word!=' '&&word!='')
        {
          result.push({ word: word, frequency: frequency });
        }
      }
    ......
}
```
### 2023.07.14起
项目进度：
- 撰写项目报告
- 准备项目答辩
