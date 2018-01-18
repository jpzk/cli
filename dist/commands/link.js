"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linker_1 = require("../utils/linker");
function link(vorpal) {
    vorpal
        .command('link')
        .description('Link scene to Ethereum.')
        .action(function (args, callback) {
        linker_1.linker(vorpal, args, callback);
    });
}
exports.link = link;
