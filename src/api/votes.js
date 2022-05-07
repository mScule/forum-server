"use strict";

const db = require("../utils/db");
const users = require("./users");
const mcache = require("memory-cache");

module.exports = {
    /**
     * @swagger
     * /votes:
     *   post:
     *     summary: Creates a new vote
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: cookie
     *         name: forum_api_key
     *         description: A cookie to identify the currently logged-in user
     *         schema:
     *           type: string
     *           example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     *       - in: body
     *         name: vote
     *         description: The vote to be created
     *         schema:
     *           type: object
     *           required:
     *             - publication_id
     *             - vote
     *           properties:
     *             publication_id:
     *               type: integer
     *             vote:
     *               type: string
     *     responses:
     *       201:
     *         description: A new vote was created.
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
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error: ..."
     */
    /*
    * Adds a vote made by the logged-in user on a specific publication.
    * */
    post: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        const statement = "INSERT INTO forum_db.votes (publication_id, user_id, vote) VALUES (?, ?, ?)";
        const values = [req.body.publication_id, currentUserId, req.body.vote];
        const result = await db.query(statement, values, res, "/votes");
        res.send(result);
    },
    /**
     * @swagger
     * /votes:
     *   put:
     *     summary: Modifies a vote
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: cookie
     *         name: forum_api_key
     *         description: A cookie to identify the currently logged-in user
     *         schema:
     *           type: string
     *           example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     *       - in: body
     *         name: vote
     *         description: The vote to be modified
     *         schema:
     *           type: object
     *           required:
     *             - vote
     *             - publication_id
     *           properties:
     *             vote:
     *               type: string
     *             publication_id:
     *               type: integer
     *     responses:
     *       200:
     *         description: A vote was modified.
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
     *         description: No vote found
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "No data modified"
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error: ..."
     */
    /*
    * Modifies a vote on a specific publication which the current logged-in user has made.
    * */
    put: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        const statement = "UPDATE forum_db.votes SET vote=? WHERE publication_id=? AND user_id=?";
        const values = [req.body.vote, req.body.publication_id, currentUserId];
        const result = await db.query(statement, values, res, "/votes");
        res.send(result);
    },
    /**
     * @swagger
     * /votes:
     *   delete:
     *     summary: Deletes a vote
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: cookie
     *         name: forum_api_key
     *         description: A cookie to identify the currently logged-in user
     *         schema:
     *           type: string
     *           example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     *       - in: body
     *         name: vote
     *         description: The vote to be deleted
     *         schema:
     *           type: object
     *           required:
     *             - publication_id
     *           properties:
     *             publication_id:
     *               type: integer
     *     responses:
     *       200:
     *         description: A vote was deleted.
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
     *         description: No vote found
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "No data modified"
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error: ..."
     */
    /*
    * Removes a vote on a specific publication which the current logged-in user has made.
    * */
    delete: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        const statement = "DELETE FROM votes WHERE publication_id=? AND user_id=?";
        const values = [req.body.publication_id, currentUserId];
        const result = await db.query(statement, values, res, "/votes");
        res.send(result);
    },
    /**
     * @swagger
     * /votes:
     *   get:
     *     summary: Gets votes.
     *       Insert "any" in any of the query parameters to not take the values of those columns into account.
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: query
     *         name: user_id
     *         schema:
     *             type: integer
     *         description: The user's ID who cast the vote(s).
     *       - in: query
     *         name: publication_id
     *         schema:
     *             type: integer
     *         description: The publication's ID which the vote(s) is/are associated with.
     *       - in: query
     *         name: vote
     *         schema:
     *           type: string
     *         description: The type of votes to get
     *     responses:
     *       200:
     *         description: Vote(s) found
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   publication_id:
     *                     type: integer
     *                   user_id:
     *                     type: string
     *                   vote:
     *                     type: string
     *       202:
     *         description: The request was accepted to be used in a database query.
     *       404:
     *         description: No data found
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "No data found"
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error: ..."
     */
    /*
    * Gets votes with specified column values. If you don't want to take certain or any of the column values into
    * account in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        if (mcache.get(req.originalUrl)) { // Check if there's already cached data
            console.log("sent cached data from " + req.originalUrl);
            res.send(mcache.get(req.originalUrl));
        } else {
            const statement = `SELECT * FROM votes WHERE user_id = IF (? = "any", user_id, ?)
            AND publication_id = IF (? = "any", publication_id, ?)
            AND vote = IF (? = "any", vote, ?)`;

            const values = [req.query.user_id, req.query.user_id, req.query.publication_id, req.query.publication_id,
                req.query.vote, req.query.vote];
            const result = await db.query(statement, values, res, "/votes");

            mcache.put(req.originalUrl, result, 900000);
            res.send(result);
        }
    }
}
