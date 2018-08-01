'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');

var formidable = require('formidable');
var fs = require('fs');

//INSERT - UPDATE
router.post('/:section/addEdit', function (req, res) {

    if (req.session.login) {

        var con = mysql.createConnection(dbparameters.connectionConfig);

        var finish = function (err) {
            if (err) {
                throw err;
            }
            con.destroy();
            res.redirect('../../admin');
        };

        var section = req.params.section;

        switch (section) {

            case 'competence':
                var form = new formidable.IncomingForm();
                form.keepExtensions = true;
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
                        sqlCat = 'INSERT INTO categories (nom_francais, nom_anglais) VALUES ?';
                        valCat = [[valCat]];
                    }
                    else {
                        categorie = fields.categorie;
                        sqlCat = 'UPDATE categories SET nom_francais = ?, nom_anglais = ? WHERE id_categorie = ?';
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

                                var values = [[[
                                    fields.nom,
                                    files.logo.name,
                                    categorie,
                                    fields.pourcent,
                                    fields.active
                                ]]];

                                con.query('INSERT INTO competences (nom_competence, lien, id_categorie, pourcent, activated) VALUES ?', values, finish);
                            });
                        }
                        else {
                            var values = [
                                fields.nom,
                                categorie,
                                fields.pourcent,
                                fields.active,
                                fields.competence
                            ];

                            con.query('UPDATE competences SET nom_competence = ?, id_categorie = ?, pourcent = ?, activated = ? WHERE id_competence = ?', values, finish);
                        }
                    });
                });
                break;

            case 'playlist':

                var sql = '';
                var values = [
                    req.body.nom,
                    req.body.hebergeur,
                    req.body.code,
                    req.body.active
                ];

                if (req.body.partner === 'add') {
                    sql = 'INSERT INTO playlists (nom_playlist, hebergeur, code, activated) VALUES ?';
                    values = [[values]];
                }
                else {
                    sql = 'UPDATE playlists SET nom_playlist = ?, hebergeur = ?, code = ?, activated = ? WHERE id_playlist = ?';
                    values.push(req.body.playlist);
                }

                con.query(sql, values, finish);
                break;

            case 'picture':
                var form = new formidable.IncomingForm();
                form.keepExtensions = true;
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        throw err;
                    }

                    if (fields.picture === 'add') {
                        var oldpath = files.img.path;
                        var newpath = './public/images/pictures/' + files.img.name;
                        fs.rename(oldpath, newpath, function (err) {
                            if (err) {
                                throw err;
                            }

                            var values = [[[
                                fields.titre,
                                files.img.name,
                                fields.active
                            ]]];

                            con.query('INSERT INTO pictures (titre, lien, activated) VALUES ?', values, finish);
                        });
                    }
                    else {
                        var values = [
                            fields.titre,
                            files.img.name,
                            fields.active,
                            fields.picture
                        ];

                        con.query('UPDATE pictures SET titre = ?, lien = ?, activated = ? WHERE id_picture = ?', values, finish);
                    }
                });
                break;

            case 'partner':

                var sql = '';
                var values = [
                    req.body.nom,
                    req.body.prenom,
                    req.body.url
                ];

                if (req.body.partner === 'add') {
                    sql = 'INSERT INTO partners (nom, prenom, url) VALUES ?';
                    values = [[values]];
                }
                else {
                    sql = 'UPDATE partners SET nom = ?, prenom = ?, url = ? WHERE id_partner = ?';
                    values.push(req.body.partner);
                }

                con.query(sql, values, finish);
                break;

            case 'game':
                var form = new formidable.IncomingForm();
                form.keepExtensions = true;
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        throw err;
                    }

                    if (fields.game === 'add') {
                        var oldpath = files.gm.path;
                        var newpath = './public/images/games/' + files.gm.name;
                        fs.rename(oldpath, newpath, function (err) {
                            if (err) {
                                throw err;
                            }

                            var values = [[[
                                fields.nom,
                                files.gm.name,
                                fields.french_description,
                                fields.english_description,
                                fields.date_debut,
                                fields.date_fin,
                                fields.lien,
                                fields.active
                            ]]];

                            con.query('INSERT INTO games (nom, image, french_description, english_description, date_debut, date_fin, lien, activated) VALUES ?', values, function (err, result) {
                                if (err) {
                                    throw err;
                                }

                                var id = result.insertId;
                                //A REVOIR
                                var insert = fields.partner.map((x, i) => [id, x, fields.fonction[i]]);

                                con.query('INSERT INTO game_partners (id_game, id_partner, fonction) VALUES ?', [insert], finish);
                            });
                        });
                    }
                    else {
                        var values = [
                            fields.nom,
                            fields.french_description,
                            fields.english_description,
                            fields.date_debut,
                            fields.date_fin,
                            fields.lien,
                            fields.active,
                            fields.game
                        ];

                        con.query('UPDATE games, SET nom = ?, french_description = ?, english_description = ?, date_debut = ?, date_fin = ?, lien = ?, activated = ? WHERE id_game = ?', values, function (err) {
                            if (err) {
                                throw err;
                            }

                            con.query("DELETE FROM game_partners WHERE id_game = ?", [fields.game], function (err) {
                                if (err) {
                                    throw err;
                                }
                                // A REVOIR
                                var insert = fields.partner.map((x, i) => [fields.game, x, fields.fonction[i]]);

                                con.query('INSERT INTO game_partners (id_game, id_partner, fonction) VALUES ?', [insert], finish);
                            });
                        });
                    }
                });
                break;

            default:
                req.session.login = false;
                res.redirect('../../');
                break;
        }
    }
    else {
        res.redirect('../../');
    }
});

//GET gamePartners
router.post('/gamePartners/get', function (req, res) {

    if (req.session.login) {
        var con = mysql.createConnection(dbparameters.connectionConfig);

        con.query("SELECT * FROM game_partners gp INNER JOIN partners p WHERE gp.id_game = ? AND gp.id_partner = p.id_partner", [req.body.id], function (err, result) {
            if (err) {
                throw err;
            }

            con.destroy();
            res.send(result);
        });
    }
    else {
        res.redirect('../../');
    }
});

//GET
router.post('/:section/get', function (req, res) {

    if (req.session.login) {
        var con = mysql.createConnection(dbparameters.connectionConfig);

        var section = req.params.section;

        con.query("SELECT * FROM " + section + "s WHERE id_" + section + " = ?", [req.body.id], function (err, result) {
            if (err) {
                throw err;
            }
            con.destroy();
            res.send(result[0]);
        });
    }
    else {
        res.redirect('../../');
    }
});

//DELETE
router.post('/:section/delete', function (req, res) {

    if (req.session.login) {
        if (req.body.delete) {
            var con = mysql.createConnection(dbparameters.connectionConfig);

            var finish = function (err) {
                if (err) {
                    throw err;
                }
                con.destroy();
                res.redirect('../../admin');
            };

            var ids = [[req.body.delete]];

            switch (req.params.section) {

                case 'competence':
                    con.query("SELECT lien FROM competences WHERE id_competence IN ?", ids, function (err, result) {
                        var paths = result.map(x => './public/images/competences/' + x.lien);

                        paths.forEach(function (value) {
                            fs.unlink(value, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        });

                        con.query("DELETE FROM competences WHERE id_competence IN ?", ids, finish);
                    });
                    break;

                case 'categorie':
                    con.query("SELECT lien FROM competences WHERE id_categorie IN ?", ids, function (err, result) {
                        var paths = result.map(x => './public/images/competences/' + x.lien);

                        paths.forEach(function (value) {
                            fs.unlink(value, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        });

                        con.query("DELETE FROM competences WHERE id_categorie IN ?", ids, function (err) {
                            if (err) {
                                throw err;
                            }

                            con.query("DELETE FROM categories WHERE id_categorie IN ?", ids, finish);
                        });
                    });
                    break;

                case 'playlist':
                    con.query("DELETE FROM playlists WHERE id_playlist IN ?", ids, finish);
                    break;

                case 'picture':
                    con.query("SELECT lien FROM pictures WHERE id_picture IN ?", ids, function (err, result) {
                        var paths = result.map(x => './public/images/pictures/' + x.lien);

                        paths.forEach(function (value) {
                            fs.unlink(value, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        });

                        con.query("DELETE FROM pictures WHERE id_picture IN ?", ids, finish);
                    });
                    break;

                case 'partner':
                    con.query("DELETE FROM game_partners WHERE id_partner IN ?", ids, function (err) {
                        if (err) {
                            throw err;
                        }
                        con.query("DELETE FROM partners WHERE id_partner IN ?", ids, finish);
                    });
                    break;

                case 'game':
                    con.query("SELECT image FROM games WHERE id_game IN ?", ids, function (err, result) {
                        var paths = result.map(x => './public/images/games/' + x.lien);

                        paths.forEach(function (value) {
                            fs.unlink(value, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        });

                        con.query("DELETE FROM game_partners WHERE id_game IN ?", ids, function (err) {
                            if (err) {
                                throw err;
                            }
                            con.query("DELETE FROM games WHERE id_game IN ?", ids, finish);
                        });
                    });
                    break;

                default:
                    req.session.login = false;
                    res.redirect('../../');
                    break;
            }
        }
        else {
            res.redirect('../../admin');
        }
    }
    else {
        res.redirect('../../');
    }
});

module.exports = router;
