"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var vorpal = require("vorpal");
var pkg = require("../package.json");
exports.VERSION = pkg.version;
exports.DELIMITER = "dcl-cli$";
exports.isDev = process.argv[1].indexOf("index") !== -1;
exports.cli = vorpal();
exports.cli
    .command("init")
    .description("Generates new Decentraland scene.")
    .option("--with-sample", "Include sample scene.")
    .action(function (args, callback) {
    var self = this;
    self.log("");
    return self.prompt({
        type: "input",
        name: "sampleScene",
        message: chalk_1.default.yellow(" Do you want to create new project with sample scene? ") + " " + chalk_1.default.red("(y/n) ")
    }, function (data) {
        if (data.sampleScene === "y") {
            self.log(" yes");
            self.log(" Great! Try out your connection.");
        }
        if (data.sampleScene === "n") {
            self.log("no");
        }
        self.log(" Invalid argument.");
    });
});
exports.cli
    .command("start")
    .description("Starts local development server.")
    .action(function (args, callback) {
    this.log("start");
    callback();
});
exports.cli
    .command("upload")
    .description("Uploads scene to IPFS.")
    .action(function (args, callback) {
    this.log("upload");
    callback();
});
exports.cli.delimiter(exports.DELIMITER).show();
if (process.argv.length > 2) {
    exports.cli.parse(process.argv);
}
else {
    exports.cli.log("DCL CLI v" + exports.VERSION + "\n");
    exports.cli.log("Welcome to the Decentraland command line tool!");
    exports.cli.log('Type "exit" to quit, "help" for a list of commands.\n');
}
