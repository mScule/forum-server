"use strict";

const db = require("../utils/db");

module.exports = {
    post: async (req, res) => {
        const statement = "INSERT INTO `forum_db`.`users` (`name`, `email`, `password`, `disabled`) VALUES (?, ?, ?, ?);";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        let result;
        try {
            result = await db.query(statement, values);
        } catch (e) {
            console.error(e.toString())
        }

        if (result === undefined) {
            res.send("Error adding user to database!");
        } else {
            res.status(201);
            res.send("User added to database!");
        }
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
        const statement = "SELECT user_id FROM users WHERE session_key =?";
        const values = [req.cookies.loginCookie];

        let result;
        try {
            result = await db.query(statement, values);
            return result[0].user_id;
        } catch (e) {
            console.error(e.toString());
        }
    }
}
