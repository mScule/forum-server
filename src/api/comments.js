"use strict";

module.exports = {
    post: (req, res) => {
        res.send("Comment post");
    },
    put: (req, res) => {
        res.send("Comment put");
    },
    delete: (req, res) => {
        res.send("Comment delete");
    },
    get: (req, res) => {
        res.send("Comment get");
    },
}
