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
                    var newpath = './public/images/competences/' + files.logo.name;
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) {
                            throw err;
                        }

                        var values = [
                            fields.nom,
                            fields.catfr,
                            fields.caten,
                            fields.pourcent,
                            fields.active
                        ];
                        var sql = '';
                        if (fields.competence === 'add') {
                            sql = "INSERT INTO yberry_competences (nom_competence, categorie_francais, categorie_anglais, pourcent, activated, lien) VALUES ?";
                            values.push(files.logo.name);
                            values = [[values]];
                        }
                        else {
                            sql = 'UPDATE yberry_competences SET nom_competence = ?, categorie_francais = ?, categorie_anglais = ?, pourcent = ?, activated = ? WHERE id_competence = ?';
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
