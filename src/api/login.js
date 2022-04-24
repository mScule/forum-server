"use strict";

const db = require("../utils/db");

module.exports = {
    login: async (req, res) => {
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);

        const statement = "UPDATE `forum_db`.`users` SET `session_key`=" + randomNumber + " WHERE `name`=? AND `password`=?";
        const values = [req.body.name, req.body.password];
        const result = await db.query(statement, values);

        if (result === undefined || result === "No rows modified") {
            res.send("Error logging in!");
        } else {
            res.status(201);

            // set a new cookie on login
            res.cookie('loginCookie', randomNumber, {maxAge: 900000, httpOnly: true});
            console.log('cookie created successfully');

            res.send("Login");
        }
    }
}