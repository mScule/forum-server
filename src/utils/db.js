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

function handleQuery(statement, values) {
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
    query: async (statement, values, res) => {
        res.status(202);
        try {
            let resolve = await handleQuery(statement, values);
            console.log("resolve: " + JSON.stringify(resolve));
            console.log("resolve.length: " + resolve.length);
            console.log("resolve.affectedRows: " + resolve.affectedRows);
            if (resolve.length === 0) {
                console.log("No result");
                resolve = "No result";
                res.status(404);
            } else if (resolve.affectedRows === 0) {
                console.log("No affected rows");
                resolve = "No result";
            } else if (resolve.affectedRows > 0 && resolve.changedRows === 0) {
                // row created
                res.status(201);
            } else if (resolve.affectedRows > 0 && resolve.changedRows > 0) {
                // row updated
                res.status(200);
            }
            return resolve;
        } catch (e) {
            console.error(e.toString());
            return e;
        }
    }
};
