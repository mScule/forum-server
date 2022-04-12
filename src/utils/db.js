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

module.exports = {
    query: (query, values) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(query, values, (errors, results) => {
                if(errors)
                    return reject(errors);
                else
                    return resolve(results);
            })
        })
    },
};
