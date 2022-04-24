"use strict";

const
    mysql = require("mysql"),
    { config } = require("./config");

const connectionPool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});


function handleQuery (statement, values) {
    return new Promise((resolve, reject) => {
        connectionPool.query(statement, values, (errors, results) => {
            if(errors)
                return reject(errors);
            else
                return resolve(results);
        })
    })
}

module.exports = {
    query: async (statement, values) => {
        try {
            const promise = await handleQuery(statement, values);
            return promise;
        } catch (e) {
            console.error(e.toString())
            return e.toString();
        }
    }
};
