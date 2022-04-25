"use strict";

const db = require("../utils/db");

module.exports = {
    logout: async (req, res) => {
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);

        const statement = "UPDATE `forum_db`.`users` SET `forum_api_key`= NULL WHERE `forum_api_key`=?";
        const values = [req.cookies.forum_api_key];
        const result = await db.query(statement, values);

        if (result === undefined || result === "No rows modified") {
            res.send("Error logging in!");
        } else {
            res.status(201);

            // set a new cookie on login
            res.cookie('forum_api_key', randomNumber, {maxAge: 900000, httpOnly: true});
            console.log('cookie created successfully');

            res.send("Login");
        }
    }
}