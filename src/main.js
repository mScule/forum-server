"use strict";

const
    express = require("express"),
    cors = require("cors"),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    {config} = require("./utils/config");

const
    {login} = require("./api/login"),
    {logout} = require("./api/logout"),
    comments = require("./api/comments"),
    posts = require("./api/posts"),
    users = require("./api/users");

(async () => {
    const app = express();

    app.use(cors({
            origin: "http://localhost:8081"
        }),
        bodyParser.urlencoded({extended: false}),
        bodyParser.json(),
        cookieParser(),
        function (req, res, next) {
            // check if client sent cookie
            const cookie = req.cookies.forum_api_key;
            if (cookie === undefined) {
                // no: send to login page
                console.log("Go to login page.")
            } else {
                // yes, cookie was already present
                console.log('cookie already exists', cookie);
            }
            next();
        });

    // Login
    app.put("/login", (req, res) => login(req, res));

    // Login
    app.put("/logout", (req, res) => login(req, res));

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
