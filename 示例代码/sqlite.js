var fs = require("fs")
var file = "crawl.db";
var sqlite = require("sqlite3").verbose()
var db = new sqlite.Database(file);

var sql = "create table if not exists fetches(id INTEGER PRIMARY KEY AUTOINCREMENT, url varchar(200), title varchar(200), content text, publish_date date)";
db.run(sql);

var insert = function(sql, sqlParam) {
    // var execSql = db.prepare(sql, sqlParam);
    db.run(sql, sqlParam, function (err) {
        if (err != null) {
            console.log(err);
            return;
        }
    });
}

var select = function (sql, sqlParam, callback) {
    db.get(sql, sqlParam, function(err, res) {
        if (callback) {
            callback(res);
        }
    });
}
exports.insert = insert;
exports.select = select;

