'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');

var formidable = require('formidable');
var fs = require('fs');

/* GET home page. */
router.post('/:section/addEdit', function (req, res) {

    if (req.session.login) {

        var con = mysql.createConnection(dbparameters.connectionConfig);

        var section = req.params.section;

        switch (section) {

            case 'competence':
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        throw err;
                    }

                    var oldpath = files.logo.path;
                    var newpath = './public/images/' + files.logo.name;
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) {
                            throw err;
                        }

                        var values = [
                            fields.nom,
                            files.logo.name,
                            fields.catfr,
                            fields.caten,
                            fields.pourcent,
                            fields.active
                        ];
                        var sql = '';
                        if (fields.competence === 'add') {
                            sql = "INSERT INTO yberry_competences (nom_competence, lien, categorie_francais, categorie_anglais, pourcent, activated) VALUES ?";
                            values = [[values]];
                        }
                        else {
                            sql = 'UPDATE yberry_competences SET nom_competence = ?, lien = ?, categorie_francais = ?, categorie_anglais = ?, pourcent = ?, activated = ? WHERE id_competence = ?';
                            values.push(fields.competence);
                        }

                        
                        con.query(sql, values, function (err, result) {
                            if (err) {
                                throw err;
                            }

                            res.redirect('../../admin');
                        });
                    });
                });
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

            con.query("DELETE FROM yberry_" + section + "s WHERE id_" + section + " IN ?", [[req.body.delete]], function (err, result, fields) {
                if (err) {
                    throw err;
                }
                con.destroy();
                res.redirect('../../admin');
            });
        }
        else {
            res.redirect('../../admin');
        }
    }
    else {
        res.redirect('../');
    }
});

module.exports = router;
