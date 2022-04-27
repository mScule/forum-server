"use strict";

const db = require("../utils/db");

module.exports = {
    /*
    * Logs the user in, creates a cookie to identify the user and adds if the given username and password match a user stored in the database.
    * Insert the username as "name" and password as "password" in the HTTP request's body in JSON format.
    * */
    login: async (req, res) => {
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);

        const statement = "UPDATE `forum_db`.`users` SET `forum_api_key`=" + randomNumber + " WHERE `name`=? AND `password`=?";
        const values = [req.body.name, req.body.password];
        const result = await db.query(statement, values, res);

        if (result === undefined || result === "No result") {
            res.status(401);
            res.send("Error logging in!");
        } else {
            // set a new cookie on login
            res.cookie('forum_api_key', randomNumber, {maxAge: 900000, httpOnly: true});
            console.log('cookie created successfully');

            res.status(201);
            res.send("Login successful");
        }
    }
}