"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vorpal = require("vorpal");
exports.cli = vorpal();
exports.DELIMITER = "dcl-cli$";
exports.cli
    .command("init", 'Outputs "bar".')
    .action(function (args, callback) {
    this.log("bar");
    callback();
});
exports.cli.delimiter(exports.DELIMITER).show();
