'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');

/* GET home page. */
router.post('/:section/addEdit', function (req, res) {

    if (req.session.login) {

        var con = mysql.createConnection(dbparameters.connectionConfig);

        var section = req.params.section;

        switch (section) {

            case 'competence':
                if (req.body.competence == 'add') {
                    var sql = "INSERT INTO yberry_competences (nom_competence, lien, categorie_francais, categorie_anglais, pourcent, activated) VALUES ?";
                    var values = [
                        req.body.nom,
                        req.body.logo,
                        req.body.catfr,
                        req.body.caten,
                        req.body.pourcent,
                        req.body.active
                    ];
                    con.query(sql, [values], function (err, result) {
                        if (err) {
                            throw err;
                        }


                    });
                }
                else {

                }
                break;

            case 'playlist':

                break;

            case 'picture':

                break;

            case 'partner':

                break;

            case 'game':

                break;

            default:
                req.session.login = false;
                res.redirect('../');
                break;
        }

        /*con.connect(function (err) {
            if (err) {
                throw err;
            }

            con.query("SELECT * FROM yberry_competences, yberry_games, yberry_game_partners, yberry_partners, yberry_yberry_pictures, yberry_playlist", function (err, result) {
                if (err) {
                    throw err;
                }
                con.destroy();
                res.render('admin', { style: 'back', competences: result, categories: result });
            });
        });*/
    }
    else {
        res.redirect('../');
    }
});

router.post('/:section/get', function (req, res) {

    if (req.session.login) {
        var con = mysql.createConnection(dbparameters.connectionConfig);

        var section = req.params.section;

        con.query("SELECT * FROM yberry_? WHERE id_? = ?", [section, section, req.body.id], function (err, result, fields) {
            if (err) {
                throw err;
            }
            con.destroy();
        });
    }
    else {
        res.redirect('../');
    }
});

router.post('/:section/delete', function (req, res) {

    if (req.session.login) {

        if (req.body.delete) {
            var con = mysql.createConnection(dbparameters.connectionConfig);

            var section = req.params.section;
            var ids = '(' + req.body.delete.join(',') + ')';

            con.query("DELETE * FROM yberry_? WHERE id_? IN ?", [section, section, ids], function (err, result, fields) {
                if (err) {
                    throw err;
                }
                con.destroy();
            });
        }
        else {
            res.redirect('../admin');
        }
    }
    else {
        res.redirect('../');
    }
});

module.exports = router;
