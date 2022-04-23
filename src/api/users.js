"use strict";

const query = require("../utils/db");

module.exports = {
    post: (req, res) => {
        // req.body.name;
        // req.body.email;
        // req.body.password;
        // req.body.disabled;

        const statement = "INSERT INTO `forum_db`.`users` (`name`, `email`, `password`, `disabled`) VALUES (?, ?, ?, ?);"
        const values = ['1', '1', '1', 0];

        query.query(statement, values);

        res.send("Users post");
    },
    put: (req, res) => {
        res.send("Users put");
    },
    delete: (req, res) => {
        res.send("Users delete");
    },
    get: (req, res) => {
        res.send("Users get");
    },
}
