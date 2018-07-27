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
            var options = { style: 'back' };
            con.query("SELECT id_competence, nom_competence, activated FROM yberry_competences", function (err, result) {
                if (err) {
                    throw err;
                }
                options.competences = result;
                con.query("SELECT id_playlist, nom_playlist, activated FROM yberry_playlists", function (err, result) {
                    if (err) {
                        throw err;
                    }
                    options.playlists = result;
                    con.query("SELECT id_picture, titre, activated FROM yberry_pictures", function (err, result) {
                        if (err) {
                            throw err;
                        }
                        options.pictures = result;
                        con.query("SELECT id_partner, nom, prenom FROM yberry_partners", function (err, result) {
                            if (err) {
                                throw err;
                            }
                            options.partners = result;
                            con.query("SELECT id_game, nom, activated FROM yberry_games", function (err, result) {
                                if (err) {
                                    throw err;
                                }
                                options.games = result;
                                con.query("SELECT id_categorie, nom_francais FROM yberry_categories", function (err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                    options.categories = result;
                                    con.destroy();
                                    res.render('admin', options);
                                });
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

router.get('/login', function (req, res) {

    if (req.session.login) {
        res.redirect('./');
    }
    else {
        res.render('login', { style: 'back', error: '' });
    }
});

router.post('/login', function (req, res) {
    var inputs = req.body;

    var con = mysql.createConnection(dbparameters.connectionConfig);

    con.connect(function (err) {
        if (err) {
            throw err;
        }

        con.query("SELECT * FROM yberry_parameters", function (err, result, fields) {
            if (err) {
                throw err;
            }

            if (inputs.admin_name === result[0].valeur && md5(inputs.admin_pwd) === result[1].valeur) {
                req.session.login = true;
                res.redirect('./');
                con.destroy();
            }
            else {
                con.destroy();
                res.render('login', { style: 'back', error: 'Désolé, le nom d\'utilisateur et / ou le mot de passe que vous avez entré n\'est pas correct. Veuillez recommencer.' });
            }
        });
    });
});

router.get('/logout', function (req, res) {
    req.session.login = false;
    res.redirect('/');
});

module.exports = router;
