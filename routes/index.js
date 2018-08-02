'use strict';
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbparameters = require('./dbparameters');
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res) {
    req.session.login = true; //DEBUG
    var options = {
        lang: 'fr',
        styles: [
            '/stylesheets/bootstrap.min.css',
            '/stylesheets/bootstrap-responsive.min.css',
            '/stylesheets/style_language.css'
        ]
    };
    res.render('index', options);
});

router.get('/tour', function (req, res) {
    res.render('tour');
});

router.post('/playlists', function (req, res) {

    var con = mysql.createConnection(dbparameters.connectionConfig);

    if (req.body.check) {
        con.query("SELECT * FROM playlists WHERE activated = 1", function (err, result) {
            if (err) {
                throw err;
            }

            con.destroy();
            res.send(result);
        });
    }
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
    };

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
