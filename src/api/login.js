"use strict";

const db = require("../utils/db");
const uuid = require("uuid");

module.exports = {
    /*
    * Logs the user in, creates a cookie to identify the user and adds if the given username and password match a user stored in the database.
    * Insert the username as "name" and password as "password" in the HTTP request's body in JSON format.
    * */
    login: async (req, res) => {
        let uuidV4 = uuid.v4();

        const statement = "UPDATE forum_db.users SET forum_api_key=? WHERE name=? AND password=?";
        const values = [uuidV4, req.body.name, req.body.password];
        const result = await db.query(statement, values, res);

        if (result === undefined || result === "No result") {
            res.status(401);
            res.send("Login failed. Check your username and password.");
        } else if (result instanceof Error) {
            res.send("Login error. " + result);
        } else {
            // set a new cookie on login
            res.cookie('forum_api_key', uuidV4, {maxAge: 900000, httpOnly: true});
            console.log('cookie created successfully');

            res.status(201);
            res.send("Login successful");
        }
    }
}