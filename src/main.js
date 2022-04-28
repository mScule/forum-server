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
    users = require("./api/users"),
    votes = require("./api/votes");

(async () => {
    const app = express();

    app.use(cors({
            origin: "http://localhost:8080/"
        }),
        bodyParser.urlencoded({extended: false}),
        bodyParser.json(),
        cookieParser(),
        function (req, res, next) {
            // check if client sent cookie
            let cookie = req.cookies.forum_api_key;
            if (cookie === undefined) {
                console.log("Not logged in")
            } else {
                // yes, cookie was already present
                console.log('Cookie already exists: ', cookie);
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
    app.put("/publications", (req, res) => publications.put(req, res));
    app.delete("/publications", (req, res) => publications.delete(req, res));
    app.get("/publications", (req, res) => publications.get(req, res));

    // Votes
    app.post("/votes", (req, res) => votes.post(req, res));
    app.put("/votes", (req, res) => votes.put(req, res));
    app.delete("/votes", (req, res) => votes.delete(req, res));
    app.get("/votes", (req, res) => votes.get(req, res));

    const server = app.listen(config.server.port, () => {
        const
            host = server.address().address === "::"
                ? "localhost"
                : server.address().address,
            port = server.address().port;

        console.log(`Server listening at http://${host}:${port}`);
    });
})();
