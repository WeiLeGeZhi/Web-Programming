var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const url = require("url");
//建立与数据库之间的连接
let dbms = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'Lorenzo33Peter36',
  database:'news'
});

dbms.connect();

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
  var counts = {};

  // 统计频数
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    if (counts[str]) {
      counts[str]++;
    } else {
      counts[str] = 1;
    }
  }

  // 构建两个数组的 JSON
  var result = [];

  for (var key in counts) {
    var word = key;
    var frequency = counts[key];
    if (word!=' '&&word!='')
    {
      result.push({ word: word, frequency: frequency });
    }
  }

  // 按频数从大到小排序
  result.sort(function(a, b) {
    return b.frequency - a.frequency;
  });

  // 只保留频数最大的五个词和频数
  result = result.slice(0, 5);

  var words = [];
  var frequencies = [];

  for (var i = 0; i < result.length; i++) {
    words.push(result[i].word);
    frequencies.push(result[i].frequency);
  }

  var sortedResult = {
    words: words,
    frequencies: frequencies
  };

  return JSON.stringify(sortedResult);
}

function countWords(arr) {
  var counts = {};

  // 统计频数
  for (var i = 0; i < arr.length; i++) {
    var word = arr[i];
    if (counts[word]) {
      counts[word]++;
    } else {
      counts[word] = 1;
    }
  }

  // 构建 JSON 数组
  var result = [];

  for (var key in counts) {
    var json = {
      name: key,
      value: counts[key]
    };
    if (!meaninglessWords.includes(key))
    {
      result.push(json);
    }
  }

  // 按频数从大到小排序
  result.sort(function(a, b) {
    return b.value - a.value;
  });

  // 只保留频数最大的五个词和频数
  result = result.slice(0, 30);

  return JSON.stringify(result);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/media_get_cloud', function(request, response) {
  //sql字符串和参数
  if (request.query.media=='p')
  {
    var fetchSql = "select keywords " +
        "from newsinfo where source_name like '%人民日报海外版%'";
  }
  else
  {
    var fetchSql = "select keywords " +
        "from newsinfo where source_name like '%中国日报%'";
  }
  dbms.query(fetchSql, function(err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    let response_json = []
    for (let list of result)
    {
      response_json = [].concat(response_json,list.keywords.split(/[ ,]/));
    }
    for (let kw = 0;kw<response_json.length;kw+=1)
    {
      response_json[kw]=response_json[kw].toLowerCase();
    }
    var output = countWords(response_json);
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(output);
    response.end();
  });
});

router.get('/date_get_cloud', function(request, response) {
  //sql字符串和参数
  var fetchSql = "select keywords " +
      "from newsinfo where publish_date like '%" + request.query.date + "%'";
  dbms.query(fetchSql, function(err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    let response_json = []
    for (let list of result)
    {
      response_json = [].concat(response_json,list.keywords.split(/[ ,]/));
    }
    for (let kw = 0;kw<response_json.length;kw+=1)
    {
      response_json[kw]=response_json[kw].toLowerCase();
    }
    var output = countWords(response_json);
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(output);
    response.end();
  });
});

router.get('/process_get_cloud', function(request, response) {
  let fetchSql = "select publish_date " +
      "from newsinfo where keywords like '%" + request.query.keyword + "%'";
  dbms.query(fetchSql,function (err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    let response_json = []
    for (let list of result)
    {
      response_json = [].concat(response_json,list.publish_date);
    }
    var output = countStringsChart(response_json);
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(output);
    response.end();
  })
})

router.get('/process_get_chart', function(request, response) {
  let fetchSql = "select source_name " +
      "from newsinfo where keywords like '%" + request.query.keyword + "%'";
  dbms.query(fetchSql,function (err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    let response_json = []
    for (let list of result)
    {
      response_json = [].concat(response_json,list.source_name);
    }
    var output = countStringsChart(response_json);
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(output);
    response.end();
  })
})

router.get('/date_get_chart', function(request, response) {
  //sql字符串和参数
  var fetchSql = "select source_name " +
      "from newsinfo where publish_date like '%" + request.query.date + "%'";
  dbms.query(fetchSql, function(err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    let response_json = []
    for (let list of result)
    {
      response_json = [].concat(response_json,list.source_name);
    }
    for (let kw = 0;kw<response_json.length;kw+=1)
    {
      response_json[kw]=response_json[kw].toLowerCase();
    }
    var output = countStringsChart(response_json);
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(output);
    response.end();
  });
});

router.get('/media_get_chart',function (req, res, next) {
  //sql字符串和参数
  if (req.query.media=='p')
  {
    var fetchSql = "select publish_date " +
        "from newsinfo where source_name like '%人民日报海外版%'";
  }
  else
  {
    var fetchSql = "select publish_date " +
        "from newsinfo where source_name like '%中国日报%'";
  }
  dbms.query(fetchSql, function (err, result, fields) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    let response_json = []
    for (let list of result)
    {
      response_json = [].concat(response_json,list.publish_date);
    }
    for (let kw = 0;kw<response_json.length;kw+=1)
    {
      response_json[kw]=response_json[kw].toLowerCase();
    }
    var output = countStringsChart(response_json);
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(output);
    res.end();
  })
})

router.get('/media_get',function (req, res, next) {
  //sql字符串和参数
  if (req.query.media=='p')
  {
    var fetchSql = "select url,title,source_name,publish_date " +
        "from newsinfo where source_name like '%人民日报海外版%'";
  }
  else
  {
    var fetchSql = "select url,title,source_name,publish_date " +
        "from newsinfo where source_name like '%中国日报%'";
  }
  dbms.query(fetchSql, function(err, result, fields) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    for (let list of result) {
      list.title = list.url+'%^&'+list.title;
      delete list.url;
    }
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    res.end();
  });
})

router.get('/date_get', function(request, response) {
  //sql字符串和参数
  var fetchSql = "select url,title,source_name,publish_date " +
      "from newsinfo where publish_date like '%" + request.query.date + "%'";
  dbms.query(fetchSql, function(err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    for (let list of result) {
      list.title = list.url+'%^&'+list.title;
      delete list.url;
    }
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

router.get('/process_get', function(request, response) {
  //sql字符串和参数
  var fetchSql = "select url,title,source_name,publish_date " +
      "from newsinfo where keywords like '%" + request.query.keyword + "%'";
  dbms.query(fetchSql, function(err, result, fields) {
    if (err) {
      console.error(err);
      response.status(500).send('Internal Server Error');
      return;
    }
    for (let list of result) {
      list.title = list.url+'%^&'+list.title;
      delete list.url;
    }
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});
module.exports = router;
