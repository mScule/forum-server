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
            const currentUser = await users.getCurrentUserId(req, res);
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
    * Sets a publication's private value to be the value of a "private" property in an HTTP request's body.
    * Also requires a "publication_id" property in the HTTP request's body to specify which publication will be modified.
    * */
    put: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUserId(req, res);
            const statement = "UPDATE forum_db.publications SET private=? WHERE publication_id=? AND user_id=?";
            const values = [req.body.private, req.body.publication_id, currentUser];
            const result = await db.query(statement, values, res);
            res.send("Publication put: " + result);
        } catch (e) {
            res.status(401);
            res.send("Error updating publication: " + e);
        }
    },
    /*
    * Deletes a publication which matches the given "publication_id" property's value.
    * */
    delete: async (req, res) => {
        const statement = "DELETE FROM publications WHERE publication_id=?";
        const values = [req.body.publication_id];
        const result = await db.query(statement, values, res);
        res.send("Publication delete: " + result);
    },
    /*
    * Gets publications with specified column values. If you don't want to take certain or any of the column values
    * into account in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        let statementLine = "";

        if (req.query.private === "any") {
            statementLine = " (private IS NULL OR private IS NOT NULL)";
        } else {
            statementLine = "private = ?";
        }
        const statement = `SELECT * FROM publications WHERE publication_id = IF (? = "any", publication_id, ?) 
            AND user_id = IF (? = "any", user_id, ?) 
            AND type = IF (? = "any", type, ?)
            AND title = IF (? = "any", title, ?)
            AND content = IF (? = "any", content, ?)
            AND ` + statementLine;
        const values =
            [req.query.publication_id, req.query.publication_id, req.query.user_id, req.query.user_id, req.query.type,
                req.query.type, req.query.title, req.query.title, req.query.content, req.query.content, req.query.private];
        const result = await db.query(statement, values, res);

        res.send(result);
    },
}
