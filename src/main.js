"use strict";

const
    express = require("express"),
    { config } = require("./utils/config");

const
    { login } = require("./api/login"),
    comments = require("./api/comments"),
    posts = require("./api/posts"),
    users = require("./api/users");

(async () => {
    const app = express();

    // Login
    app.post("/login", (req, res) => login(req, res));

    // User
    app.post("/users", (req, res) => users.post(req, res));
    app.put("/users", (req, res) => users.put(req, res));
    app.delete("/users", (req, res) => users.delete(req, res));
    app.get("/users", (req, res) => users.get(req, res));

    // Post
    app.post("/posts", (req, res) => posts.post(req, res));
    app.put("/posts", (req, res) => posts.put(req, res));
    app.delete("/posts", (req, res) => posts.delete(req, res));
    app.get("/posts", (req, res) => posts.get(req, res));

    // Comment
    app.post("/comments", (req, res) => comments.post(req, res));
    app.put("/comments", (req, res) => comments.delete(req, res));
    app.delete("/comments", (req, res) => comments.put(req, res));
    app.get("/comments", (req, res) => comments.get(req, res));

    const server = app.listen(config.server.port, () => {
        const
            host = server.address().address === "::"
                ? "localhost"
                : server.address().address,
            port = server.address().port;

        console.log(`Server listening at http://${host}:${port}`);
    });
})();
