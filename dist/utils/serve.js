"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const is_dev_1 = require("../utils/is-dev");
const liveServer = require('live-server');
function serve(vorpal, args) {
    vorpal.log(chalk_1.default.blue('Parcel server is starting...\n'));
    const dir = is_dev_1.isDev ? './tmp/dcl-app' : '.';
    liveServer.start({
        port: 2044,
        host: '0.0.0.0',
        root: dir,
        open: true,
        ignore: '.decentraland',
        file: 'scene.html',
        wait: 500,
        logLevel: 3
    });
}
exports.serve = serve;
