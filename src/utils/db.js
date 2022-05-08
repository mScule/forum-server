"use strict";

const
    mysql = require("mysql"),
    {config} = require("./config"),
    {clearCache} = require("./cache");

const connectionPool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

/*
* Executes a database query and returns a rejection with errors if the query has problems or a resolve with results
* if the query was successful.
* */
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
    * Queries the database and returns results or errors. Responds with different HTTP response status codes
    * according to the query's outcome.
    * */
    query: async (statement, values, res, urlRoot) => {
        res.status(202);
        console.log(JSON.stringify(values));
        console.log(JSON.stringify(statement));
        try {
            let resolve = await executeQuery(statement, values);
            // console.log("resolve: " + JSON.stringify(resolve));
            console.log("resolve.length: " + resolve.length);
            console.log("resolve.affectedRows: " + resolve.affectedRows);
            if (resolve.length === 0) {
                console.log("No data found");
                // resolve = "No data found";
                res.status(404);
            } else if (resolve.affectedRows === 0) {
                console.log("No data modified");
                // resolve = "No data modified";
                res.status(404);
            } else if (resolve.affectedRows > 0 && resolve.changedRows === 0) {
                // row created
                clearCache(urlRoot);
                res.status(201);
            } else if (resolve.affectedRows > 0 && resolve.changedRows > 0) {
                // row updated
                clearCache(urlRoot);
                res.status(200);
            } else if (resolve.length > 0) {
                // found data
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
