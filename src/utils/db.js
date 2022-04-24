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
    query: async (statement, values) => {
        try {
            const resolve = await handleQuery(statement, values);
            console.log(resolve.length)
            console.log(resolve.affectedRows)
            if (resolve.length === 0 || resolve.affectedRows === 0) {
                console.log("No result")
                return "No result";
            }
            return resolve;
        } catch (e) {
            console.error(e.toString())
            return e;
        }
    }
};
