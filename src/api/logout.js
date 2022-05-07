"use strict";

const db = require("../utils/db");
const mcache = require("memory-cache");

module.exports = {
    /**
     * @swagger
     * /logout:
     *   put:
     *     summary: Logs a user out
     *     responses:
     *       200:
     *         description: The logged-in user was logged out and a login cookie was cleared.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Logout successful"
     *       202:
     *         description: The request was accepted be used in a database query.
     *       404:
     *         description: Error logging out
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error logging out! ..."
     */

    /*
    * Logs the user out by setting the user's identifier "forum_api_key" NULL in the database's "users" table and
    * clearing the cookie which identifies the user.
    * */
    logout: async (req, res) => {
        const statement = "UPDATE forum_db.users SET forum_api_key= NULL WHERE forum_api_key=?";
        console.log("req.cookies['forum_api_key']: " + req.cookies["forum_api_key"]);
        const values = [req.cookies["forum_api_key"]];
        const result = await db.query(statement, values, res, "/users");

        if (result === undefined || result === "No data modified" || result === "No data found"
            || result instanceof Error) {
            res.status(404);
            res.send("Error logging out! " + result);
        } else {
            // Clear user api key cache and cookie
            mcache.del(req.cookies["forum_api_key"]);
            res.clearCookie("forum_api_key");
            res.status(200);
            res.send("Logout successful");
        }
    }
}