"use strict";

module.exports = {
    login: (req, res) => {
        // set a new cookie on login
        let randomNumber=Math.random().toString();
        randomNumber=randomNumber.substring(2,randomNumber.length);
        res.cookie('loginCookie',randomNumber, { maxAge: 900000, httpOnly: true });
        console.log('cookie created successfully');

        res.send("Login");
    }
}