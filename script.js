// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mustacheExpress = require('mustache-express');

// Initialise objects and declare constants
const app = express();
const webPort = 8088;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "MyAnimeList"
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Connected to database");
});

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './templates');
app.use(express.static('./htmlscripts'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    db.query("SELECT COUNT(*) as count FROM Themes", function (error, results, fields) {
        if (error) {
            throw error;
        }
        res.render('index', { theme_count: results[0].count });
    });
});

app.get('/about.html', function (req, res) {
    const query1 = new Promise((resolve, reject) => {
        db.query("SELECT * FROM Themes", function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    const query2 = new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM Themes", function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count);
            }
        });
    });

    Promise.all([query1, query2]).then((results) => {
        res.render('about', { data: results[0], anime_count: results[1] });
    }).catch((error) => {
        throw error;
    });

});

app.get('/alltime.html', function (req, res) {
    db.query("SELECT * FROM Themes LIMIT 10", function (error, results, fields) {
        if (error) {
            throw error;
        }
        res.render('alltime', { theme_count: results[0].count });
    });
});

app.get('/2022.html', function (req, res) {
    db.query("SELECT * FROM Themes LIMIT 10", function (error, results, fields) {
        if (error) {
            throw error;
        }
        res.render('2022', { theme_count: results[0].count });
    });
});

app.listen(
    webPort,
    () => console.log('EMO app listening on port ' + webPort) // success callback
);
