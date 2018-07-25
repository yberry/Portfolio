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

                    var categorie = '';
                    var sqlCat = '';
                    var valCat = [
                        fields.catfr,
                        fields.caten
                    ];
                    if (fields.categorie === 'add') {
                        sqlCat = 'INSERT INTO yberry_categories (nom_francais, nom_anglais) VALUES ?';
                        valCat = [[valCat]];
                    }
                    else {
                        categorie = fields.categorie;
                        sqlCat = 'UPDATE yberry_categories SET nom_francais = ?, nom_anglais = ? WHERE id_categorie = ?';
                        valCat.push(categorie);
                    }

                    con.query(sqlCat, valCat, function (err, result) {
                        if (err) {
                            throw err;
                        }

                        if (categorie === '') {
                            categorie = result.insertId;
                        }

                        if (fields.competence === 'add') {
                            var oldpath = files.logo.path;
                            var newpath = './public/images/competences/' + files.logo.name;
                            fs.rename(oldpath, newpath, function (err) {
                                if (err) {
                                    throw err;
                                }

                                var sql = 'INSERT INTO yberry_competences (nom_competence, lien, id_categorie, pourcent, activated) VALUES ?';
                                var values = [[[
                                    fields.nom,
                                    files.logo.name,
                                    categorie,
                                    fields.pourcent,
                                    fields.active
                                ]]];

                                con.query(sql, values, function (err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                    con.destroy();
                                    res.redirect('../../admin');
                                });
                            });
                        }
                        else {
                            var sql = 'UPDATE yberry_competences SET nom_competence = ?, id_categorie = ?, pourcent = ?, activated = ? WHERE id_competence = ?';
                            var values = [
                                fields.nom,
                                categorie,
                                fields.pourcent,
                                fields.active,
                                fields.competence
                            ];

                            con.query(sql, values, function (err, result) {
                                if (err) {
                                    throw err;
                                }
                                con.destroy();
                                res.redirect('../../admin');
                            });
                        }
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
    }
    else {
        res.redirect('../');
    }
});

router.post('/gamePartners/get', function (req, res) {

    if (req.session.login) {
        var con = mysql.createConnection(dbparameters.connectionConfig);

        var section = req.params.section;

        con.query("SELECT * FROM yberry_game_partners WHERE id_game = ?", [req.body.id], function (err, result) {
            if (err) {
                throw err;
            }

            var values = result.map(x => x.id_partner);
            con.query("SELECT * FROM yberry_partners WHERE id_partner IN ?", [[values]], function (err, result2) {
                if (err) {
                    throw err;
                }

                result.forEach(function (value, index) {
                    result2[index].fonction = value.fonction;
                });

                con.destroy();
                res.send(result2);
            });
        });
    }
    else {
        res.redirect('../');
    }
});

router.post('/:section/get', function (req, res) {

    if (req.session.login) {
        var con = mysql.createConnection(dbparameters.connectionConfig);

        var section = req.params.section;

        con.query("SELECT * FROM yberry_" + section + "s WHERE id_" + section + " = ?", [req.body.id], function (err, result) {
            if (err) {
                throw err;
            }
            con.destroy();
            res.send(result[0]);
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

            con.query("DELETE FROM yberry_" + section + "s WHERE id_" + section + " IN ?", [[req.body.delete]], function (err, result) {
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
