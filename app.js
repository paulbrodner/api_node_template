const sqlite3 = require('sqlite3');
const express = require("express");
const path = require('path');

var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

const db = new sqlite3.Database('./environments.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run('CREATE TABLE environments( \
            name NVARCHAR(20) NOT NULL UNIQUE,\
            author NVARCHAR(20)  NOT NULL,\
            branch NVARCHAR(20) NOT NULL,\
            pods INTEGER DEFAULT 1 NOT NULL,\
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP \
        )', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
});

// HTML - I bet this can be enhanced
app.get("/dashboard", (req, res, next) => {
    var sql = "select * from environments ORDER BY created DESC";
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.render('dashboard', { title: 'Dashboard', environments: rows });
    });
});

// API
app.get("/:name", (req, res, next) => {
    db.get(`SELECT * FROM environments where name = ?`, [req.params.name], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});

app.get("/", (req, res, next) => {
    const filters = req.query;
    var sql = "select * from environments ORDER BY created DESC";
    var params = []
    if (filters.branch) {
        sql = `select * from environments where branch = ?  ORDER BY created DESC`;
        params = [filters.branch]
    }
    if (filters.author) {
        sql = `select * from environments where author = ?  ORDER BY created DESC`;
        params = [filters.author]
    }
    if (filters.author && filters.branch) {
        sql = `select * from environments where author = ? and branch = ? ORDER BY created DESC`;
        params = [filters.author, filters.branch]
    }
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({rows});
    });
});

app.post("/", (req, res, next) => {
    var reqBody = req.body
    db.run(`INSERT OR REPLACE INTO environments (name, author, branch, pods, created) VALUES (?,?,?,?,?)`,
        [reqBody.name, reqBody.author, reqBody.branch, reqBody.pods, new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '')],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                message: this.changes
            })
        });
});

app.delete("/:name", (req, res, next) => {
    db.run(`DELETE FROM environments WHERE name = ?`,
        req.params.name,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ message: this.changes })
        });
});

