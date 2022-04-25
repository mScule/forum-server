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

            res.send("Comment post result: " + result);
        } catch (e) {
            res.send("Comment post result: " + e);
        }
    },
    put: (req, res) => {
        res.send("Comment put");
    },
    delete: (req, res) => {
        res.send("Comment delete");
    },
    get: async (req, res) => {
        // Get publication rows with certain column values or leave the column values blank to not take their values into account in the query.
        const statement = `SELECT * FROM publications WHERE publication_id = IF (? = '', publication_id, ?) 
            AND user_id = IF (? = '', user_id, ?) 
            AND type = IF (? = '', type, ?)`;
        const values = [req.body.publication_id, req.body.publication_id, req.body.user_id, req.body.user_id, req.body.type, req.body.type];
        const result = await db.query(statement, values);

        console.log("Publication get: " + JSON.stringify(result))

        res.send("Publication get: " + JSON.stringify(result));
    },
}
