"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const budo = require("budo");
function default_1(args, vorpal, callback) {
    vorpal.log(chalk_1.default.blue("Starting local development server for Decentraland scene...\n"));
    budo("./", {
        host: "0.0.0.0",
        live: true,
        port: 8080,
        stream: process.stdout
    });
}
exports.default = default_1;
