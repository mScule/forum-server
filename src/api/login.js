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
     *         description: A user was logged in.
     *          A login cookie was created and linked to the logged-in user in the database.
     *          Responds with data of the logged-in user.
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
     *                     nullable: true
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
     *       401:
     *         description: Login failed
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Login failed. Check your username and password."
     *       500:
     *         description: Some error happened
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: "Login error. Error: ..."
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

        if (result === undefined || result === "No data modified" || result === "No data found") {
            res.status(401);
            res.send("Login failed. Check your username and password.");
        } else if (result instanceof Error) {
            res.send("Login error. " + result);
        } else {
            const statement = `SELECT user_id, name, email, image, disabled FROM users WHERE forum_api_key=? AND name=? 
                AND password=?`;
            const values = [uuidV4, req.body.name, req.body.password];
            const result = await db.query(statement, values, res, "/users");

            // set a new cookie on login
            res.cookie('forum_api_key', uuidV4, {maxAge: 900000, httpOnly: true});
            console.log('cookie created successfully');

            mcache.put(uuidV4, result[0].user_id, 900000);
            res.status(201);
            res.send(result);
        }
    }
}