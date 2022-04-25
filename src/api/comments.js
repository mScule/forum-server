// "use strict";
//
// const db = require("../utils/db");
// const users = require("./users");
//
// module.exports = {
//     post: async (req, res) => {
//         try {
//             const currentUser = await users.getCurrentUser(req);
//             console.log("currentUser: " + currentUser);
//
//             const statement = "INSERT INTO `forum_db`.`publications` (`user_id`, `type`, `title`, `content`, `private`) VALUES (?, ?, ?, ?, ?)";
//             const values = [currentUser, "comment", req.body.title, req.body.content, 0];
//             const result = await db.query(statement, values);
//
//             res.send("Comment post result: " + result);
//         } catch (e) {
//             res.send("Comment post result: " + e);
//         }
//     },
//     put: (req, res) => {
//         res.send("Comment put");
//     },
//     delete: (req, res) => {
//         res.send("Comment delete");
//     },
//     get: async (req, res) => {
//         const statement = "SELECT * FROM publications WHERE forum_api_key =?";
//         const values = [currentUser, "comment", req.body.title, req.body.content, 0];
//         const result = await db.query(statement, values);
//
//         res.send("Comment get");
//     },
// }
