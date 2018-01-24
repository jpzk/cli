"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const get_root_1 = require("./get-root");
const liveServer = require('live-server');
function serve(vorpal, args) {
    vorpal.log(chalk_1.default.blue('Parcel server is starting...\n'));
    liveServer.start({
        port: 2044,
        host: '0.0.0.0',
        root: get_root_1.getRoot(),
        open: true,
        ignore: '.decentraland',
        file: 'scene.html',
        wait: 500,
        logLevel: 3
    });
}
exports.serve = serve;
