'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');
var nodemailer = require('nodemailer');
var sizeOf = require('image-size');

/* GET home page. */
router.get('/', function (req, res) {

    var con = mysql.createConnection(dbparameters.connectionConfig);

    con.connect(function (err) {
        if (err) {
            throw err;
        }
        var options = {};
        con.query("SELECT * FROM yberry_categories ORDER BY id_categorie", function (err, result) {
            if (err) {
                throw err;
            }
            var categories = result;
            con.query("SELECT * FROM yberry_competences WHERE activated = 1", function (err, result) {
                if (err) {
                    throw err;
                }
                categories.forEach(function (cat, index) {
                    var competences = [];
                    result.forEach(function (comp) {
                        if (cat.id_categorie == comp.id_categorie) {
                            competences.push(comp);
                        }
                    })
                    categories[index].competences = competences;
                });
                options.categories = categories;
                con.query("SELECT * FROM yberry_pictures WHERE activated = 1", function (err, result) {
                    if (err) {
                        throw err;
                    }
                    options.pictures = result;
                    con.query("SELECT * FROM yberry_games WHERE activated = 1", function (err, result) {
                        if (err) {
                            throw err;
                        }
                        var games = result;
                        con.query("SELECT * FROM yberry_game_partners gp INNER JOIN yberry_partners p WHERE gp.id_partner = p.id_partner", function (err, result) {
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

                                var fin = new Date(game.date_fin);
                                var debut = new Date(game.date_debut);

                                var millisecs = fin - debut;
                                var years = Math.trunc(millisecs / 31536000000);
                                if (years > 0) {
                                    games[index].duree = years + ' an' + (years > 1 ? 's' : '');
                                }
                                else {
                                    var months = Math.trunc(millisecs / 2628000000);
                                    if (months > 0) {
                                        games[index].duree = months + ' mois';
                                    }
                                    else {
                                        var days = Math.trunc(millisecs / 86400000);
                                        games[index].duree = days + ' jour' + (days > 1 ? 's' : '');
                                    }
                                }

                                var dimensions = sizeOf('./public/images/games/' + game.image);
                                var new_height = 200;
                                var new_width = Math.trunc(new_height * dimensions.width / dimensions.height);
                                if (new_width > 320) {
                                    new_width = 320;
                                    new_height = Math.trunc(new_width * dimensions.height / dimensions.width);
                                }
                                games[index].dimensions = { width: new_width, height: new_height };
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

    con.query("SELECT * FROM yberry_playlists WHERE activated = 1", function (err, result) {
        if (err) {
            throw err;
        }

        con.destroy();
        res.send(result);
    });
});

router.post('/mail', function (req, res) {

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'yanisberry16@gmail.com',
            pass: 'Xenogoogle16'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'Portfolio <' + req.body.from + '>',
        replyTo: req.body.from,
        to: 'yanisberry16@gmail.com',
        subject: req.body.object,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            res.send('0');
        }
        else {
            res.send('1');
        }
    });
});

module.exports = router;
