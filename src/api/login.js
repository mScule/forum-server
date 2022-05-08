"use strict";

const db = require("../utils/db");
const uuid = require("uuid");
const mcache = require("memory-cache");

module.exports = {
    /**
     * @swagger
     * /login:
     *   put:
     *     summary: Logs a user in
     *     consumes:
     *       - application/json
     *     parameters:
     *       - in: body
     *         name: user
     *         description: The user to log in.
     *         schema:
     *           type: object
     *           required:
     *             - name
     *             - password
     *           properties:
     *             name:
     *               type: string
     *             password:
     *               type: string
     *     responses:
     *       201:
     *         description: A user was logged in. A login cookie was created and linked to the logged-in user in the database.
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
     *       401:
     *         description: Login failed
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
    * Logs the user in, creates a cookie to identify the user and adds if the given username and password
    * match a user stored in the database. Insert the username as "name" and password as "password" in the
    * HTTP request's body in JSON format.
    * */
    login: async (req, res) => {
        let uuidV4 = uuid.v4();
        const statement = "UPDATE forum_db.users SET forum_api_key=? WHERE name=? AND password=?";
        const values = [uuidV4, req.body.name, req.body.password];
        const result = await db.query(statement, values, res, "/users");

        if (result === undefined || result.length === 0 || result.affectedRows === 0) {
            res.status(401);
        } else {
            const statement = `SELECT user_id, name, email, image, disabled FROM users WHERE forum_api_key=? AND name=? 
                AND password=?`;
            const values = [uuidV4, req.body.name, req.body.password];
            const resultUserInfo = await db.query(statement, values, res, "/users");

            // set a new cookie on login
            res.cookie('forum_api_key', uuidV4, {maxAge: 900000, httpOnly: true});
            console.log('cookie created successfully');

            mcache.put(uuidV4, resultUserInfo[0].user_id, 900000);
            res.status(201);
        }
        res.send(result);
    }
}