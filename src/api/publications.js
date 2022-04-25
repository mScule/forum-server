"use strict";

const db = require("../utils/db");
const users = require("./users");

module.exports = {
    post: async (req, res) => {
        try {
            const currentUser = await users.getCurrentUser(req);
            console.log("currentUser: " + currentUser);

            const statement = "INSERT INTO `forum_db`.`publications` (`user_id`, `type`, `title`, `content`, `private`) VALUES (?, ?, ?, ?, ?)";
            const values = [currentUser, req.body.type, req.body.title, req.body.content, 0];
            const result = await db.query(statement, values);

            res.send("Publication post result: " + result);
        } catch (e) {
            res.send("Publication post result: " + e);
        }
    },
    put: async (req, res) => {
        const statement = "UPDATE `forum_db`.`publications` SET `private`=? WHERE `publication_id`=?";
        const values = [req.body.private, req.body.publication_id];
        const result = await db.query(statement, values);

        res.send("Publication put: " + result);
    },
    delete: async (req, res) => {
        const statement = "DELETE FROM publications WHERE publication_id=?";
        const values = [req.body.publication_id];
        const result = await db.query(statement, values);

        res.send("Publication delete: " + result);
    },
    get: async (req, res) => {
        // Get publication rows with certain column values or leave the column values blank to not take their values into account in the query.
        const statement = `SELECT * FROM publications WHERE publication_id = IF (? = '', publication_id, ?) 
            AND user_id = IF (? = '', user_id, ?) 
            AND type = IF (? = '', type, ?)
            AND title = IF (? = '', title, ?)
            AND content = IF (? = '', content, ?)
            AND private = IF (? = '', private, ?)`;
        const values = [req.body.publication_id, req.body.publication_id, req.body.user_id, req.body.user_id, req.body.type, req.body.type,
            req.body.title, req.body.title, req.body.content, req.body.content, req.body.private, req.body.private];
        const result = await db.query(statement, values);

        console.log("Publication get: " + JSON.stringify(result))

        res.send("Publication get: " + JSON.stringify(result));
    },
}
