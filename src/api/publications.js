"use strict";

const db = require("../utils/db");
const users = require("./users");

module.exports = {
    /*
    * Gets the current user's id from the database with the "forum_api_key" cookie which identifies the user.
    * Adds a publication to the database which is associated with the current user's id.
    * Insert the to be added publication's type as "type", title as "title" and content as "content" in the
    * HTTP request's body in JSON format.
    * */
    post: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUser(req, res);
            console.log("currentUser: " + currentUser);

            const statement = `INSERT INTO forum_db.publications (user_id, type, title, content, private) 
                VALUES (?, ?, ?, ?, ?)`;
            const values = [currentUser, req.body.type, req.body.title, req.body.content, 0];
            const result = await db.query(statement, values, res);

            res.send("Publication post result: " + result);
        } catch (e) {
            res.status(401);
            res.send("Publication error: " + e);
        }
    },
    /*
    * Sets a publication private.
    * */
    put: async (req, res) => {
        const currentUser = await users.getCurrentUser(req, res);
        const statement = "UPDATE forum_db.publications SET private=? WHERE publication_id=? AND user_id=?";
        const values = [req.body.private, req.body.publication_id, currentUser];
        const result = await db.query(statement, values, res);
        res.send("Publication put: " + result);
    },
    /*
    * Deletes a publication.
    * */
    delete: async (req, res) => {
        const statement = "DELETE FROM publications WHERE publication_id=?";
        const values = [req.body.publication_id];
        const result = await db.query(statement, values, res);
        res.send("Publication delete: " + result);
    },
    /*
    * Gets publications
    * */
    get: async (req, res) => {
        let statementLine = "";

        if (req.body.private === "any") {
            statementLine = " (private IS NULL OR private IS NOT NULL)";
        } else {
            statementLine = "private = ?";
        }
        // Get publication rows with certain column values or don't take the column values into account if the
        // request for them is "any".
        const statement = `SELECT * FROM publications WHERE publication_id = IF (? = "any", publication_id, ?) 
            AND user_id = IF (? = "any", user_id, ?) 
            AND type = IF (? = "any", type, ?)
            AND title = IF (? = "any", title, ?)
            AND content = IF (? = "any", content, ?)
            AND ` + statementLine;
        const values =
            [req.body.publication_id, req.body.publication_id, req.body.user_id, req.body.user_id, req.body.type,
            req.body.type, req.body.title, req.body.title, req.body.content, req.body.content, req.body.private];
        const result = await db.query(statement, values, res);

        res.send(result);
    },
}
