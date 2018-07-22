'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');

var con = mysql.createConnection(dbparameters.connectionConfig);

/* GET home page. */
router.get('/', function (req, res) {

    con.connect(function (err) {
        if (err) {
            throw err;
        }

        con.query("SELECT * FROM yberry_games", function (err, result, fields) {
            if (err) {
                throw err;
            }

            res.render('index', { title: 'Express', games: result });
        });
    });

});

module.exports = router;
