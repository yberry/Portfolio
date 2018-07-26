'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');
var md5 = require('md5');

/* GET home page. */
router.get('/', function (req, res) {

    if (req.session.login) {

        var con = mysql.createConnection(dbparameters.connectionConfig);

        con.connect(function (err) {
            if (err) {
                throw err;
            }
            var options = {};
            con.query("SELECT * FROM yberry_competences", function (err, result) {
                if (err) {
                    throw err;
                }
                options.competences = result;
                con.query("SELECT * FROM yberry_pictures", function (err, result) {
                    if (err) {
                        throw err;
                    }
                    options.pictures = result;
                    con.query("SELECT * FROM yberry_partners", function (err, result) {
                        if (err) {
                            throw err;
                        }
                        options.partners = result;
                        con.query("SELECT * FROM yberry_games", function (err, result) {
                            if (err) {
                                throw err;
                            }
                            options.games = result;
                            con.query("SELECT * FROM yberry_categories", function (err, result) {
                                if (err) {
                                    throw err;
                                }
                                options.categories = result;
                                con.destroy();
                                res.render('fr', options);
                            });
                        });
                    });
                });
            });
        });
    }
    else {
        res.redirect('../');
    }
});

module.exports = router;
