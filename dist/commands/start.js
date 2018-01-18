"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serve_1 = require("../utils/serve");
function start(vorpal) {
    vorpal
        .command('start')
        .alias('serve')
        .description('Starts local development server.')
        .action(function (args, callback) {
        serve_1.serve(vorpal, args);
    });
}
exports.start = start;
