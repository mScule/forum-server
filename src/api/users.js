"use strict";

const db = require("../utils/db");

module.exports = {
    /*
    * Creates a new user. Requires the user's "name", "email", "password" and "disabled" status as properties in the
    * HTTP request's body.
    * */
    post: async (req, res) => {
        const statement = "INSERT INTO forum_db.users (name, email, password, disabled) VALUES (?, ?, ?, ?)";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values, res);
        res.send(result);
    },

    /*
    * Updates a user's info. Requires the user's new email "email_new", new password "password_new", "disabled" status,
    * current email "email_current", current password "password_current" and "forum_api_key" as properties in the HTTP
    * request's body.
    * */
    put: async (req, res) => {
        const statement = `UPDATE forum_db.users SET email=?, password=?, disabled=? WHERE email=? 
            AND password=? AND forum_api_key=?`;
        const values = [req.body.email_new, req.body.password_new, req.body.disabled,
            req.body.email_current, req.body.password_current, req.body.forum_api_key];
        const result = await db.query(statement, values, res);
        res.send("Users put: " + JSON.stringify(result));
    },

    /*
    * Deletes a user. Requires the user's "email", "password" and "forum_api_key" as properties in the HTTP
    * request's body.
    * */
    delete: async (req, res) => {
        const statement = "DELETE FROM users WHERE email=? AND password=? AND forum_api_key=?";
        const values = [req.body.email, req.body.password, req.cookies["forum_api_key"]];
        const result = await db.query(statement, values, res);
        res.send("Users delete: " + result);
    },

    /*
    * Gets the current logged-in user's data or gets users with specified column values if the param "get_current_user"
    * equals "false" in the HTTP request. If you don't want to take certain or any of the column values into account
    * in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        let statement = `SELECT user_id, name, email, image, disabled FROM users WHERE forum_api_key = ?`;
        let values = [req.cookies["forum_api_key"]];

        if (req.query["get_current_user"] === "false") {
            let statementLine = "disabled = disabled";

            if (req.body.disabled === 1 || req.body.disabled === "1") {
                statementLine = "disabled = 1";
            } else if (req.body.disabled === 0 || req.body.disabled === "0") {
                statementLine = "disabled = 0";
            }
            statement = `SELECT user_id, name, email, image, disabled FROM users
            WHERE user_id = IF (? = "any", user_id, ?)
            AND name = IF (? = "any", name, ?)
            AND email = IF (? = "any", email, ?)
            AND password = password
            AND ` + statementLine;

            values = [req.body.user_id, req.body.user_id, req.body.name, req.body.name, req.body.email,
                req.body.email, req.body.disabled, req.body.disabled];
        }

        const result = await db.query(statement, values, res);

        res.send(result);
    },

    /*
    * Gets the current logged-in user's id.
    * */
    getCurrentUserId: async (req, res) => {
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
