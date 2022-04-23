"use strict";

const db = require("../utils/db");

module.exports = {
    post: async (req, res) => {
        const statement = "INSERT INTO `forum_db`.`users` (`name`, `email`, `password`, `disabled`) VALUES (?, ?, ?, ?);";
        const values = [req.body.name, req.body.email, req.body.password, req.body.disabled];
        const result = await db.query(statement, values);

        if(result.affectedRows > 0){
            res.status(201);
            res.send("User added to database!");
        }else{
            res.status(304);
            res.send("Error adding user to database!");
        }
    },
    put: (req, res) => {
        res.send("Users put");
    },
    delete: (req, res) => {
        res.send("Users delete");
    },
    get: (req, res) => {
        res.send("Users get");
    },
}
