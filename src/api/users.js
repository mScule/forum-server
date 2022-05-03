"use strict";

const db = require("../utils/db");
const mcache = require("memory-cache");

module.exports = {
    /*
    * Creates a new user. Requires the user's "name", "email", "password" and "disabled" status as properties in the
    * HTTP request's body.
    * */
    post: async (req, res) => {
        const statement = "INSERT INTO forum_db.users (name, email, password, disabled) VALUES (?, ?, ?, ?)";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values, res, "/users");
        res.send(result);
    },

    /*
    * Updates a user's info. Requires the user's new email "email_new", new password "password_new", "disabled" status,
    * current email "email_current" and current password "password_current" as properties in the HTTP
    * request's body.
    * */
    put: async (req, res) => {
        try {
            const currentUserId = await module.exports.getCurrentUserId(req, res);
            const statement = `UPDATE forum_db.users SET email=?, password=?, disabled=? WHERE email=? 
            AND password=? AND user_id=?`;
            const values = [req.body.email_new, req.body.password_new, req.body.disabled,
                req.body.email_current, req.body.password_current, currentUserId];
            const result = await db.query(statement, values, res, "/users");
            res.send("Users put: " + JSON.stringify(result));
        } catch (e) {
            res.status(401);
            res.send("Error updating user info: " + e);
        }
    },

    /*
    * Deletes a user. Requires the user's "email" and "password" as properties in the HTTP
    * request's body.
    * */
    delete: async (req, res) => {
        try {
            const currentUserId = await module.exports.getCurrentUserId(req, res);
            const statement = "DELETE FROM users WHERE email=? AND password=? AND user_id=?";
            const values = [req.body.email, req.body.password, currentUserId];
            const result = await db.query(statement, values, res, "/users");
            res.send("Users delete: " + JSON.stringify(result));
        } catch (e) {
            res.status(401);
            res.send("Error deleting user: " + e);
        }
    },

    /*
    * Gets the currently logged-in user's data or gets users with specified column values if the param "get_current_user"
    * equals "false" in the HTTP request. If you don't want to take certain or any of the column values into account
    * in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        if (mcache.get(req.originalUrl)) { // Check if there's already cached data
            console.log("sent cached data from " + req.originalUrl);
            res.send(mcache.get(req.originalUrl));
        } else {
            let statement = `SELECT user_id, name, email, image, disabled FROM users WHERE forum_api_key = ?`;
            let values = [req.cookies["forum_api_key"]];

            if (req.query["get_current_user"] === "false") {
                let statementLine = "disabled = disabled";

                if (req.query.disabled === 1 || req.query.disabled === "1") {
                    statementLine = "disabled = 1";
                } else if (req.query.disabled === 0 || req.query.disabled === "0") {
                    statementLine = "disabled = 0";
                }
                statement = `SELECT user_id, name, email, image, disabled FROM users
            WHERE user_id = IF (? = "any", user_id, ?)
            AND name = IF (? = "any", name, ?)
            AND email = IF (? = "any", email, ?)
            AND password = password
            AND ` + statementLine;

                values = [req.query.user_id, req.query.user_id, req.query.name, req.query.name, req.query.email,
                    req.query.email, req.query.disabled, req.query.disabled];
            }

            const result = await db.query(statement, values, res, "/users");

            mcache.put(req.originalUrl, result, 900000);
            res.send(result);
        }
    },

    /*
    * Gets the currently logged-in user's id.
    * */
    getCurrentUserId: async (req, res) => {
        if (mcache.get(req.originalUrl)) { // Check if there's already cached data
            console.log("sent cached data from " + req.originalUrl);
            return mcache.get(req.originalUrl);
        } else {
            const statement = "SELECT user_id FROM users WHERE forum_api_key =?";
            const values = [req.cookies["forum_api_key"]];
            console.log("req.cookies['forum_api_key']: " + req.cookies["forum_api_key"]);
            const result = await db.query(statement, values, res, "/users");
            console.log("result: " + result);
            if (result !== "No data found") {
                console.log("TEST");
                mcache.put(req.originalUrl, result[0].user_id, 900000);
                return result[0].user_id;
            } else {
                throw result;
            }
        }
    }
}
