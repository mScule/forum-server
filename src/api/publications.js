"use strict";

const db = require("../utils/db");
const users = require("./users");
const mcache = require("memory-cache");

module.exports = {
    /**
     * @swagger
     * /publications:
     *   post:
     *     summary: Creates a publication
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
     *         name: publication
     *         description: The publication to be created
     *         schema:
     *           type: object
     *           required:
     *             - type
     *             - title
     *             - content
     *           properties:
     *             type:
     *               type: string
     *             title:
     *               type: string
     *             content:
     *               type: string
     *             reply_to_id:
     *               type: integer
     *     responses:
     *       201:
     *         description: A new publication was created.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication post result: ..."
     *       202:
     *         description: The request was accepted be used in a database query.
     *       401:
     *         description: Error creating a publication
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication post result: ..."
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication post result: Error: ..."
     */
    /*
    * Gets the current user's id from the database with the "forum_api_key" cookie which identifies the user.
    * Adds a publication to the database which is associated with the current user's id.
    * Insert the to be added publication's type as "type", title as "title", content as "content" and if the
    * publication is a reply to another publication, add the publication's id which the to be added publication
    * replies to as "reply_to_id" in the HTTP request's body in JSON format.
    * */
    post: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        console.log("currentUserId: " + currentUserId);

        const statement = `INSERT INTO forum_db.publications (user_id, type, title, content, private, reply_to_id) 
                VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [currentUserId, req.body.type, req.body.title, req.body.content, 0, req.body.reply_to_id];
        const result = await db.query(statement, values, res, "/publications");

        res.send("Publication post result: " + result);
    },
    /**
     * @swagger
     * /publications:
     *   put:
     *     summary: Modifies a publication's private value
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
     *         name: publication
     *         description: The publication to be modified
     *         schema:
     *           type: object
     *           required:
     *             - private
     *             - publication_id
     *           properties:
     *             private:
     *               type: integer
     *             publication_id:
     *               type: string
     *     responses:
     *       200:
     *         description: A publication was modified.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication put: ..."
     *       202:
     *         description: Request was accepted to a database query.
     *       404:
     *         description: No publication found
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication put: ..."
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication put: Error: ..."
     */
    /*
    * Sets a publication's private value to be the value of a "private" property in an HTTP request's body.
    * Also requires a "publication_id" property in the HTTP request's body to specify which publication will be modified.
    * */
    put: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        const statement = "UPDATE forum_db.publications SET private=? WHERE publication_id=? AND user_id=?";
        const values = [req.body.private, req.body.publication_id, currentUserId];
        const result = await db.query(statement, values, res, "/publications");
        res.send("Publication put: " + result);
    },
    /**
     * @swagger
     * /publications:
     *   delete:
     *     summary: Deletes a publication
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: body
     *         name: publication
     *         description: The publication to be deleted
     *         schema:
     *           type: object
     *           required:
     *             - publication_id
     *           properties:
     *             publication_id:
     *               type: integer
     *     responses:
     *       200:
     *         description: A publication was deleted.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication delete: ..."
     *       202:
     *         description: Request was accepted to a database query.
     *       404:
     *         description: No publication with the specified publication_id found
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication delete: ..."
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Publication delete: Error: ..."
     */
    /*
    * Deletes a publication which matches the given "publication_id" property's value.
    * */
    delete: async (req, res) => {
        const statement = "DELETE FROM publications WHERE publication_id=?";
        const values = [req.body.publication_id];
        const result = await db.query(statement, values, res, "/publications");
        res.send("Publication delete: " + result);
    },
    /**
     * @swagger
     * /publications get:
     *   get:
     *     summary: Gets publications
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: query
     *         name: publication_id
     *         required: true
     *         schema:
     *             type: integer
     *         description: The publication's ID
     *       - in: query
     *         name: user_id
     *         required: true
     *         schema:
     *             type: integer
     *         description: The user's ID who created the publication
     *       - in: query
     *         name: type
     *         required: true
     *         schema:
     *           type: string
     *         description: The type of publication, a "post" or a "comment"
     *       - in: query
     *         name: title
     *         required: true
     *         schema:
     *           type: string
     *         description: The publication's title
     *       - in: query
     *         name: content
     *         required: true
     *         schema:
     *           type: string
     *         description: The publication's content
     *       - in: query
     *         name: private
     *         required: true
     *         schema:
     *           type: integer
     *         description: Is the publication private or public
     *       - in: query
     *         name: date_max
     *         schema:
     *           type: string
     *         description: The publication's maximum date of creation
     *       - in: query
     *         name: date_min
     *         schema:
     *           type: string
     *         description: The publication's minimum date of creation
     *       - in: query
     *         name: reply_to_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: If the publication is a reply, the ID of the publication this publication refers to.
     *     responses:
     *       200:
     *         description: Publications found
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
     *                     type: integer
     *                   type:
     *                     type: string
     *                   title:
     *                     type: string
     *                   private:
     *                     type: object
     *                     properties:
     *                       type:
     *                         type: string
     *                       data:
     *                         type: array
     *                         items:
     *                           type: integer
     *                   date:
     *                     type: string
     *                   reply_to_id:
     *                     type: integer
     *       202:
     *         description: Request was accepted to a database query.
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
    * Gets publications with specified column values. If you don't want to take certain or any of the column values
    * into account in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        if (mcache.get(req.originalUrl)) { // Check if there's already cached data
            console.log("sent cached data from " + req.originalUrl);
            res.send(mcache.get(req.originalUrl));
        } else {
            const values =
                [req.query.publication_id, req.query.publication_id, req.query.user_id, req.query.user_id, req.query.type,
                    req.query.type, req.query.title, req.query.title, req.query.content, req.query.content];

            let queryPrivate = "";
            if (req.query.private === "any") {
                queryPrivate = " AND (private IS NULL OR private IS NOT NULL)";
            } else {
                queryPrivate = " AND private = ?";
                values.push(req.query.private);
            }

            let queryReplyToId = "";
            if (req.query.reply_to_id === "any") {
                queryReplyToId = " AND (reply_to_id IS NULL OR reply_to_id IS NOT NULL)";
            } else {
                queryReplyToId = " AND reply_to_id = ?";
                values.push(req.query.reply_to_id);
            }

            // Query for publications with any date if there are no boundary dates specified in the request
            let queryDate = " AND date = date";

            // Check if only a minimum date is specified for a range of dates
            if (req.query.date_min && req.query.date_min !== "" && (!req.query.date_max || req.query.date_max === "")) {
                queryDate = " AND date >= ?";
                values.push(req.query.date_min);
            }
            // Check if only a maximum date is specified for a range of dates
            else if (req.query.date_max && req.query.date_max !== "" && (!req.query.date_min || req.query.date_min === "")) {
                queryDate = " AND date <= ?";
                values.push(req.query.date_max);
            }
            // Check if a minimum and a maximum bound are specified for a range of dates
            else if (req.query.date_max && req.query.date_max !== "" && req.query.date_min && req.query.date_min !== "") {
                queryDate = " AND (date BETWEEN ? AND ?)";
                values.push(req.query.date_min);
                values.push(req.query.date_max);
            }

            const statement = `SELECT * FROM publications WHERE publication_id = IF (? = "any", publication_id, ?) 
            AND user_id = IF (? = "any", user_id, ?) 
            AND type = IF (? = "any", type, ?)
            AND title = IF (? = "any", title, ?)
            AND content = IF (? = "any", content, ?)`
                + queryPrivate + queryReplyToId + queryDate;
            const result = await db.query(statement, values, res, "/publications");

            mcache.put(req.originalUrl, result, 900000);
            res.send(result);
        }
    }
}
