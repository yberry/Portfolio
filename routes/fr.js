'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');
var md5 = require('md5');

/* GET home page. */
router.get('/', function (req, res) {

    var con = mysql.createConnection(dbparameters.connectionConfig);

    con.connect(function (err) {
        if (err) {
            throw err;
        }
        var options = {};
        con.query("SELECT * FROM yberry_categories", function (err, result) {
            if (err) {
                throw err;
            }
            var categories = result;
            con.query("SELECT * FROM yberry_competences", function (err, result) {
                if (err) {
                    throw err;
                }
                categories.forEach(function (cat, index) {
                    var competences = [];
                    result.forEach(function (comp) {
                        if (comp.activated && cat.id_categorie == comp.id_categorie) {
                            competences.push(comp);
                        }
                    })
                    categories[index].competences = competences;
                });
                options.categories = categories;
                con.query("SELECT * FROM yberry_pictures", function (err, result) {
                    if (err) {
                        throw err;
                    }
                    options.pictures = result;
                    con.query("SELECT * FROM yberry_games", function (err, result) {
                        if (err) {
                            throw err;
                        }
                        var games = result;
                        con.query("SELECT * FROM yberry_game_partners INNER JOIN yberry_partners WHERE yberry_game_partners.id_partner = yberry_partners.id_partner", function (err, result) {
                            if (err) {
                                throw err;
                            }
                            games.forEach(function (game, index) {
                                var partners = [];
                                result.forEach(function (part) {
                                    if (game.id_game == part.id_game) {
                                        partners.push(part);
                                    }
                                })
                                games[index].partners = partners;
                            })
                            options.games = games;
                            con.destroy();
                            res.render('fr', options);
                        });
                    });
                });
            });
        });
    });
});

router.post('/playlists', function (req, res) {

    var con = mysql.createConnection(dbparameters.connectionConfig);

    con.query("SELECT * FROM yberry_playlists", function (err, result) {
        if (err) {
            throw err;
        }

        con.destroy();
        res.send(result);
    });
});

module.exports = router;
