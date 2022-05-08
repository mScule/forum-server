"use strict";

const db = require("../utils/db");
const mcache = require("memory-cache");

module.exports = {
    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Creates a new user account
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: body
     *         name: user
     *         description: The user to be created
     *         schema:
     *           type: object
     *           required:
     *             - name
     *             - email
     *             - password
     *             - disabled
     *           properties:
     *             name:
     *               type: string
     *             email:
     *               type: string
     *             password:
     *               type: string
     *             disabled:
     *               type: integer
     *     responses:
     *       201:
     *         description: A new user was created.
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
    * Creates a new user. Requires the user's "name", "email", "password" and "disabled" status as properties in the
    * HTTP request's body.
    * */
    post: async (req, res) => {
        const statement = "INSERT INTO forum_db.users (name, email, password, disabled) VALUES (?, ?, ?, ?)";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values, res, "/users");
        res.send(result);
    },
    /**
     * @swagger
     * /users:
     *   put:
     *     summary: Modifies a user's info
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
     *         name: user
     *         description: The user to be modified
     *         schema:
     *           type: object
     *           required:
     *             - username_new
     *             - email_new
     *             - password_new
     *             - disabled
     *             - email_current
     *             - password_current
     *           properties:
     *             username_new:
     *               type: string
     *             email_new:
     *               type: string
     *             password_new:
     *               type: string
     *             disabled:
     *               type: integer
     *             email_current:
     *               type: string
     *             password_current:
     *               type: string
     *     responses:
     *       200:
     *         description: A user was modified.
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
     *         description: No user found
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
    * Updates a user's info. Requires the user's new email "email_new", new password "password_new", "disabled" status,
    * current email "email_current" and current password "password_current" as properties in the HTTP
    * request's body.
    * */
    put: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        const statement = `UPDATE forum_db.users SET name=?, email=?, password=?, disabled=? WHERE email=? 
            AND password=? AND user_id=?`;
        const values = [req.body.username_new, req.body.email_new, req.body.password_new, req.body.disabled,
            req.body.email_current, req.body.password_current, currentUserId];
        const result = await db.query(statement, values, res, "/users");
        res.send(result);
    },
    /**
     * @swagger
     * /users:
     *   delete:
     *     summary: Deletes a user
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
     *         name: user
     *         description: The user to be deleted
     *         schema:
     *           type: object
     *           required:
     *             - email
     *             - password
     *           properties:
     *             email:
     *               type: string
     *             password:
     *               type: string
     *     responses:
     *       200:
     *         description: A user was deleted.
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
     *         description: No user found
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
    * Deletes a user. Requires the user's "email" and "password" as properties in the HTTP
    * request's body.
    * */
    delete: async (req, res) => {
        const currentUserId = mcache.get(req.cookies["forum_api_key"]);
        const statement = "DELETE FROM users WHERE email=? AND password=? AND user_id=?";
        const values = [req.body.email, req.body.password, currentUserId];
        const result = await db.query(statement, values, res, "/users");
        res.send(result);
    },
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Gets the current user's data or gets any other users' data if a "get_current_user" parameter
     *       which value equals "false" is inserted as a parameter.
     *       Insert "any" in any of the other query parameters to not take the values of those columns into account.
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: query
     *         name: get_current_user
     *         schema:
     *             type: boolean
     *         description: Set the value to "false" if you want to get other than the currently logged-in user's data.
     *       - in: query
     *         name: user_id
     *         schema:
     *             type: integer
     *         description: A specific user's ID
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: A specific user's name
     *       - in: query
     *         name: email
     *         schema:
     *           type: string
     *         description: A specific user's email
     *       - in: query
     *         name: disabled
     *         schema:
     *           type: integer
     *         description: Is the user account disabled from use or not.
     *           The value "0" means the account is enabled and "1" means the account is disabled.
     *     responses:
     *       200:
     *         description: User(s) found
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   user_id:
     *                     type: integer
     *                   name:
     *                     type: string
     *                   email:
     *                     type: string
     *                   image:
     *                     type: string
     *                     format: binary
     *                   disabled:
     *                     type: object
     *                     properties:
     *                       type:
     *                         type: string
     *                       data:
     *                         type: array
     *                         items:
     *                           type: integer
     *       202:
     *         description: The request was accepted to be used in a database query.
     *       404:
     *         description: No data found
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               example: []
     *       500:
     *         description: An error occurred in the database query.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Error: ..."
     */
    /*
    * Gets the currently logged-in user's data or gets users with specified column values if the param "get_current_user"
    * equals "false" in the HTTP request. If you don't want to take certain or any of the column values into account
    * in the query, insert the value "any" to their respective properties in the HTTP request's body.
    * */
    get: async (req, res) => {
        if (mcache.get(req.originalUrl)) { // Check if there's already cached data
            res.send(mcache.get(req.originalUrl));
        } else {
            let statement = `SELECT user_id, name, email, image, disabled FROM users WHERE forum_api_key = ?`;
            let values = [req.cookies["forum_api_key"]];

            if (req.query["get_current_user"] === "false") {
                let statementLine = "disabled = disabled";

                if (req.query.disabled === 1 || req.query.disabled === "1") {
                    statementLine = "disabled = 1";
                } else if (req.query.disabled === 0 || req.query.disabled === "0") {
                    statementLine = "disabled = 0";
                }
                statement = `SELECT user_id, name, email, image, disabled FROM users
            WHERE user_id = IF (? = "any", user_id, ?)
            AND name = IF (? = "any", name, ?)
            AND email = IF (? = "any", email, ?)
            AND password = password
            AND ` + statementLine;

                values = [req.query.user_id, req.query.user_id, req.query.name, req.query.name, req.query.email,
                    req.query.email, req.query.disabled, req.query.disabled];
            }

            const result = await db.query(statement, values, res, "/users");

            mcache.put(req.originalUrl, result, 900000);
            res.send(result);
        }
    }
}
