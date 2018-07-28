'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    req.session.login = true; //DEBUG
    res.render('index', { style: 'language' });
    
});

router.get('/tour', function (req, res) {
    res.render('tour');
});

module.exports = router;
