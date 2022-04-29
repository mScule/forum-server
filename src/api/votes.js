"use strict";

const db = require("../utils/db");
const users = require("./users");

module.exports = {
    post: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUser(req, res);

            const statement = "INSERT INTO forum_db.votes (publication_id, user_id, vote) VALUES (?, ?, ?)";
            const values = [req.body.publication_id, currentUser, req.body.vote];
            const result = await db.query(statement, values, res);
            res.send(result);
        } catch (e) {
            res.status(401);
            res.send("Error creating vote: " + e);
        }
    },

    put: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUser(req, res);

            const statement = "UPDATE forum_db.votes SET vote=? WHERE publication_id=? AND user_id=?";
            const values = [req.body.vote, req.body.publication_id, currentUser];
            const result = await db.query(statement, values, res);
            res.send("Votes put: " + JSON.stringify(result));
        } catch (e) {
            res.status(401);
            res.send("Error updating vote: " + e);
        }
    },

    delete: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUser(req, res);

            const statement = "DELETE FROM votes WHERE publication_id=? AND user_id=?";
            const values = [req.body.publication_id, currentUser];
            const result = await db.query(statement, values, res);
            res.send("Votes delete: " + result);
        } catch (e) {
            res.status(401);
            res.send("Error deleting vote: " + e);
        }
    },

    get: async (req, res) => {
        // Get votes rows with certain column values or don't take the column values into account if the request for
        // them is "any".
        const statement = `SELECT * FROM votes WHERE user_id = IF (? = "any", user_id, ?)
            AND publication_id = IF (? = "any", publication_id, ?)
            AND vote = IF (? = "any", vote, ?)`;

        const values = [req.body.user_id, req.body.user_id, req.body.publication_id, req.body.publication_id,
            req.body.vote, req.body.vote];
        const result = await db.query(statement, values, res);

        res.send(result);
    }
}
