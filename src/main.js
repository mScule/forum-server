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
    publications = require("./api/publications"),
    // posts = require("./api/posts"),
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
            let cookie = req.cookies.forum_api_key;
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

    // Logout
    app.put("/logout", (req, res) => logout(req, res));

    // Users
    app.post("/users", (req, res) => users.post(req, res));
    app.put("/users", (req, res) => users.put(req, res));
    app.delete("/users", (req, res) => users.delete(req, res));
    app.get("/users", (req, res) => users.get(req, res));

    // Publications
    app.post("/publications", (req, res) => publications.post(req, res));
    app.put("/publications", (req, res) => publications.delete(req, res));
    app.delete("/publications", (req, res) => publications.put(req, res));
    app.get("/publications", (req, res) => publications.get(req, res));

    // // Posts
    // app.post("/posts", (req, res) => posts.post(req, res));
    // app.put("/posts", (req, res) => posts.put(req, res));
    // app.delete("/posts", (req, res) => posts.delete(req, res));
    // app.get("/posts", (req, res) => posts.get(req, res));

    const server = app.listen(config.server.port, () => {
        const
            host = server.address().address === "::"
                ? "localhost"
                : server.address().address,
            port = server.address().port;

        console.log(`Server listening at http://${host}:${port}`);
    });
})();
