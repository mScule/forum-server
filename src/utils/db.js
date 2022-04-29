"use strict";

const
    mysql = require("mysql"),
    {config} = require("./config");

const connectionPool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

function executeQuery(statement, values) {
    return new Promise((resolve, reject) => {
        connectionPool.query(statement, values, (errors, results) => {
            if (errors)
                return reject(errors);
            else
                return resolve(results);
        })
    })
}

module.exports = {
    /*
    * Query the database and return a result or an error and respond with different HTTP response status codes accordingly.
    * */
    query: async (statement, values, res) => {
        res.status(202);
        try {
            let resolve = await executeQuery(statement, values);
            console.log("resolve: " + JSON.stringify(resolve));
            console.log("resolve.length: " + resolve.length);
            console.log("resolve.affectedRows: " + resolve.affectedRows);
            if (resolve.length === 0) {
                console.log("No data found");
                resolve = "No data found";
                res.status(404);
            } else if (resolve.affectedRows === 0) {
                console.log("No data modified");
                resolve = "No data modified";
            } else if (resolve.affectedRows > 0 && resolve.changedRows === 0) {
                // row created
                res.status(201);
            } else if (resolve.affectedRows > 0 && resolve.changedRows > 0) {
                // row updated
                res.status(200);
            }
            return resolve;
        } catch (e) {
            res.status(500);
            console.error(e.toString());
            return e;
        }
    }
};
