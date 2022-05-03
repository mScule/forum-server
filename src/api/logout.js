"use strict";

const db = require("../utils/db");

module.exports = {
    /*
    * Logs the user out by setting the user's identifier "forum_api_key" NULL in the database's "users" table and
    * clearing the cookie which identifies the user.
    * */
    logout: async (req, res) => {
        const statement = "UPDATE forum_db.users SET forum_api_key= NULL WHERE forum_api_key=?";
        console.log("req.cookies['forum_api_key']: " + req.cookies["forum_api_key"]);
        const values = [req.cookies["forum_api_key"]];
        const result = await db.query(statement, values, res, "/users");
        res.clearCookie("forum_api_key");

        if (result === undefined || result === "No data modified" || result === "No data found"
            || result instanceof Error) {
            res.status(404);
            res.send("Error logging out! " + result);
        } else {
            res.status(200);
            res.send("Logout successful");
        }
    }
}