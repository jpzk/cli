"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const nextConfig = require("../../next.config");
const express = require('express');
const next = require('next');
const app = next({ quiet: true, conf: nextConfig });
const handle = app.getRequestHandler();
function default_1(args, vorpal, callback) {
    vorpal.log(chalk_1.default.blue("\nConfiguring linking app...\n"));
    app.prepare().then(() => {
        const server = express();
        server.get('/linker', (req, res) => {
            return app.render(req, res, '/linker', req.query);
        });
        server.get('/linking-finished', (req, res) => {
        });
        server.get('*', (req, res) => {
            return handle(req, res);
        });
        server.listen(4044, (err) => {
            if (err)
                throw err;
            vorpal.log("Linking app ready.");
            vorpal.log(`Please proceed to link: ${chalk_1.default.blue("http://localhost:4044/linker")}.`);
        });
    });
}
exports.default = default_1;
