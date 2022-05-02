"use strict";

const db = require("../utils/db");
const users = require("./users");

module.exports = {
    /*
    * Adds a vote made by the logged-in user on a specific publication.
    * */
    post: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUserId(req, res);

            const statement = "INSERT INTO forum_db.votes (publication_id, user_id, vote) VALUES (?, ?, ?)";
            const values = [req.body.publication_id, currentUser, req.body.vote];
            const result = await db.query(statement, values, res);
            res.send(result);
        } catch (e) {
            res.status(401);
            res.send("Error creating vote: " + e);
        }
    },

    /*
    * Modifies a vote on a specific publication which the current logged-in user has made.
    * */
    put: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUserId(req, res);

            const statement = "UPDATE forum_db.votes SET vote=? WHERE publication_id=? AND user_id=?";
            const values = [req.body.vote, req.body.publication_id, currentUser];
            const result = await db.query(statement, values, res);
            res.send("Votes put: " + JSON.stringify(result));
        } catch (e) {
            res.status(401);
            res.send("Error updating vote: " + e);
        }
    },

    /*
    * Removes a vote on a specific publication which the current logged-in user has made.
    * */
    delete: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUserId(req, res);

            const statement = "DELETE FROM votes WHERE publication_id=? AND user_id=?";
            const values = [req.body.publication_id, currentUser];
            const result = await db.query(statement, values, res);
            res.send("Votes delete: " + result);
        } catch (e) {
            res.status(401);
            res.send("Error deleting vote: " + e);
        }
    },

    /*
    * Gets votes with specified column values. If you don't want to take certain or any of the column values into
    * account in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        const statement = `SELECT * FROM votes WHERE user_id = IF (? = "any", user_id, ?)
            AND publication_id = IF (? = "any", publication_id, ?)
            AND vote = IF (? = "any", vote, ?)`;

        const values = [req.query.user_id, req.query.user_id, req.query.publication_id, req.query.publication_id,
            req.query.vote, req.query.vote];
        const result = await db.query(statement, values, res);

        res.send(result);
    }
}
