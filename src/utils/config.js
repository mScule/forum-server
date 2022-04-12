"use strict";
const fileStream = require("fs");
const configFile = JSON.parse(fileStream.readFileSync("./server-config.json", "utf8"));
module.exports.config = configFile;
