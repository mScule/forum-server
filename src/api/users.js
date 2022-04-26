"use strict";

const db = require("../utils/db");

module.exports = {
    post: async (req, res) => {
        res.status(202);
        const statement = "INSERT INTO `forum_db`.`users` (`name`, `email`, `password`, `disabled`) VALUES (?, ?, ?, ?);";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values);
        res.status(201);
        res.send(result);
    },
    put: async (req, res) => {
        res.status(202);
        const statement = `UPDATE forum_db.users SET email=?, password=?, image=?, disabled=? WHERE email=? AND password=? AND forum_api_key=?`;
        const values = [req.body.email_new, req.body.password_new, req.body.image, req.body.disabled, req.body.email_current, req.body.password_current, req.body.forum_api_key];
        const result = await db.query(statement, values);

        res.status(200);
        res.send("Users put: " + JSON.stringify(result));
    },
    delete: async (req, res) => {
        res.status(202);
        const statement = "DELETE FROM users WHERE user_id=?";
        const values = [req.body.user_id];
        const result = await db.query(statement, values);

        res.status(200);
        res.send("Users delete: " + result);
    },
    get: async (req, res) => {
        res.status(202);
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

        res.status(200);
        res.send(result);
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
