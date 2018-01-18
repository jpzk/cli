"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uploader_1 = require("../utils/uploader");
const linker_1 = require("../utils/linker");
function push(vorpal) {
    vorpal
        .command('push')
        .description('Upload, link IPNS, and link Ethereum in one go.')
        .action(function (args, callback) {
        uploader_1.uploader(vorpal, args, callback).then(() => linker_1.linker(vorpal, args, callback));
    });
}
exports.push = push;
