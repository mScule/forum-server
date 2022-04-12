"use strict";

module.exports = {
    post: (req, res) => {
        res.send("Users post");
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
