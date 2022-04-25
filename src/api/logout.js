"use strict";

const db = require("../utils/db");

module.exports = {
    logout: async (req, res) => {
        const statement = "UPDATE `forum_db`.`users` SET `forum_api_key`= NULL WHERE `forum_api_key`=?";
        console.log("req.cookies.forum_api_key: " + req.cookies.forum_api_key)
        const values = [req.cookies.forum_api_key];
        const result = await db.query(statement, values);
        res.clearCookie("forum_api_key");

        if (result === undefined || result === "No result") {
            res.send("Error logging out!");
        } else {
            res.status(201);
            res.send("Logout successful");
        }
    }
}