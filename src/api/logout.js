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
     *         description: A user was logged out and a login cookie was cleared.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 fieldCount:
     *                   type: integer
     *                 affectedRows:
     *                   type: integer
     *                 insertId:
     *                   type: integer
     *                 serverStatus:
     *                   type: integer
     *                 warningCount:
     *                   type: integer
     *                 message:
     *                   type: string
     *                 protocol41:
     *                   type: boolean
     *                 changedRows:
     *                   type: integer
     *       202:
     *         description: The request was accepted to be used in a database query.
     *       404:
     *         description: Error logging out
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 fieldCount:
     *                   type: integer
     *                 affectedRows:
     *                   type: integer
     *                 insertId:
     *                   type: integer
     *                 serverStatus:
     *                   type: integer
     *                 warningCount:
     *                   type: integer
     *                 message:
     *                   type: string
     *                 protocol41:
     *                   type: boolean
     *                 changedRows:
     *                   type: integer
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error: ..."
     */
    /*
    * Logs the user out by setting the user's identifier "forum_api_key" NULL in the database's "users" table and
    * clearing the cookie which identifies the user.
    * */
    logout: async (req, res) => {
        const statement = "UPDATE forum_db.users SET forum_api_key= NULL WHERE forum_api_key=?";
        const values = [req.cookies["forum_api_key"]];
        const result = await db.query(statement, values, res, "/users");
        if (!(result === undefined || result.length === 0 || result.affectedRows === 0
            || result instanceof Error)) {
            // Clear user api key cache and cookie
            mcache.del(req.cookies["forum_api_key"]);
            res.clearCookie("forum_api_key");
        }
        res.send(result);
    }
}