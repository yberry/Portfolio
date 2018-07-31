'use strict';
var express = require('express');
var router = express.Router();

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

module.exports = router;
