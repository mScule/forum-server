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
    delete: async (req, res) => {
        const statement = "DELETE FROM users WHERE user_id=?";
        const values = [req.body.user_id];
        const result = await db.query(statement, values);

        res.send("Users delete: " + result);
    },
    get: async (req, res) => {
        let statementLine = "";

        if (req.body.forum_api_key === "") {
            statementLine = " IS NULL OR forum_api_key IS NOT NULL"
        } else {
            statementLine = "= ?";
        }

        // Get user rows with certain column values or leave the column values blank to not take their values into account in the query.
        const statement = `SELECT * FROM users WHERE user_id = IF (? = '', user_id, ?)
            AND name = IF (? = '', name, ?)
            AND email = IF (? = '', email, ?)
            AND disabled = IF (? = '', disabled, ?)
            AND forum_api_key` + statementLine;

        const values = [req.body.user_id, req.body.user_id, req.body.name, req.body.name, req.body.email, req.body.email,
            req.body.disabled, req.body.disabled, req.body.forum_api_key, req.body.forum_api_key];
        const result = await db.query(statement, values);

        res.send("Users get: " + JSON.stringify(result));
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
