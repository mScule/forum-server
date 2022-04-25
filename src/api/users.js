"use strict";

const db = require("../utils/db");

module.exports = {
    post: async (req, res) => {
        const statement = "INSERT INTO `forum_db`.`users` (`name`, `email`, `password`, `disabled`) VALUES (?, ?, ?, ?);";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values);
        res.send(result);
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
    getCurrentUser: async (req) => {
        const statement = "SELECT user_id FROM users WHERE forum_api_key =?";
        const values = [req.cookies.forum_api_key];
        console.log("req.cookies.forum_api_key: " + req.cookies.forum_api_key)
        const result = await db.query(statement, values);
        console.log("result: " + result)
        if (result !== "No result") {
            console.log("TEST");
            return result[0].user_id;
        } else {
            throw result;
        }
    }
}
