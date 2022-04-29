"use strict";

const db = require("../utils/db");

module.exports = {
    post: async (req, res) => {
        const statement = "INSERT INTO forum_db.users (name, email, password, disabled) VALUES (?, ?, ?, ?)";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values, res);
        res.send(result);
    },

    put: async (req, res) => {
        const statement = `UPDATE forum_db.users SET email=?, password=?, image=?, disabled=? WHERE email=? 
            AND password=? AND forum_api_key=?`;
        const values = [req.body.email_new, req.body.password_new, req.body.image, req.body.disabled,
            req.body.email_current, req.body.password_current, req.body.forum_api_key];
        const result = await db.query(statement, values, res);
        res.send("Users put: " + JSON.stringify(result));
    },

    delete: async (req, res) => {
        const statement = "DELETE FROM users WHERE email=? AND password=? AND forum_api_key=?";
        const values = [req.body.email, req.body.password, req.cookies["forum_api_key"]];
        const result = await db.query(statement, values, res);
        res.send("Users delete: " + result);
    },

    get: async (req, res) => {
        // // Get user rows with certain column values or don't take the column values into account if the request
        // // for them is "any".
        // let statementLine = "disabled = disabled";
        //
        // if (req.body.disabled === 1 || req.body.disabled === "1") {
        //     statementLine = "disabled = 1";
        // } else if (req.body.disabled === 0 || req.body.disabled === "0") {
        //     statementLine = "disabled = 0";
        // }
        // const statement = `SELECT user_id, name, email, image, disabled FROM users
        //     WHERE user_id = IF (? = "any", user_id, ?)
        //     AND name = IF (? = "any", name, ?)
        //     AND email = IF (? = "any", email, ?)
        //     AND password = password
        //     AND ` + statementLine;
        //
        // const values = [req.body.user_id, req.body.user_id, req.body.name, req.body.name, req.body.email,
        // req.body.email, req.body.disabled, req.body.disabled];

        const statement = `SELECT user_id, name, email, image, disabled FROM users WHERE forum_api_key = ?`;

        const values = [req.cookies["forum_api_key"]];
        const result = await db.query(statement, values, res);

        res.send(result);
    },

    getCurrentUser: async (req, res) => {
        const statement = "SELECT user_id FROM users WHERE forum_api_key =?";
        const values = [req.cookies["forum_api_key"]];
        console.log("req.cookies['forum_api_key']: " + req.cookies["forum_api_key"]);
        const result = await db.query(statement, values, res);
        console.log("result: " + result);
        if (result !== "No data found") {
            console.log("TEST");
            return result[0].user_id;
        } else {
            throw result;
        }
    }
}
