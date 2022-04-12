"use strict";

module.exports = {
    post: (req, res) => {
        res.send("Posts post");
    },
    put: (req, res) => {
        res.send("Posts put");
    },
    delete: (req, res) => {
        res.send("Posts delete");
    },
    get: (req, res) => {
        res.send("Posts get");
    },
}
