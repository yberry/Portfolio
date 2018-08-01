var mysql = require('mysql');
var dbparameters = require('./dbparameters');

var con = mysql.createConnection(dbparameters.connectionConfig);

con.connect(function (err) {
    if (err) {
        throw err;
    }

    con.query("SELECT * FROM games", function (err, result) {
        if (err) {
            throw err;
        }

        console.log(result[0].french_description);
    });
})