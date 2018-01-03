"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const path = require("path");
const vorpal = require("vorpal");
const start_server_1 = require("./utils/start-server");
const pkg = require("../package.json");
exports.VERSION = pkg.version;
exports.DELIMITER = "dcl-cli$";
exports.isDev = process.argv[1].indexOf("index") !== -1;
exports.cli = vorpal();
exports.cli
    .command("init")
    .description("Generates new Decentraland scene.")
    .option("-f, --force", "Force file overwrites.")
    .option("-p, --path <path>", "Output path (default is the current working directory).")
    .option("--with-sample", "Include sample scene.")
    .action(function (args, callback) {
    const self = this;
    self.log(args);
    const root = path.resolve(".");
    console.log(root);
    if (args.options["with-sample"]) {
        self.log(" Creating new project with sample scene...");
    }
    else {
        self.prompt({
            type: "input",
            name: "sampleScene",
            message: `${chalk_1.default.yellow(" Do you want to create new project with sample scene? ")} ${chalk_1.default.red("(y/n) ")}`
        }, (data) => {
            self.log(data);
            if (data.sampleScene === "y") {
                self.log(" Creating new project with sample scene...");
            }
            if (data.sampleScene === "n") {
                self.log(" Creating new project with sample scene...");
            }
            if (data.sampleScene === "") {
            }
            self.log(" Invalid argument.");
            callback();
        });
    }
});
exports.cli
    .command("start")
    .alias("run")
    .description("Starts local development server.")
    .action(function (args, callback) {
    const self = this;
    start_server_1.default
        .bind(exports.cli)(args)
        .then((response) => {
        self.log(chalk_1.default.green(response));
    })
        .catch((error) => {
        if (error) {
            self.log(chalk_1.default.red("There was a problem starting local development server."));
            self.log(error.message);
        }
    });
    callback();
});
exports.cli
    .command("upload")
    .description("Uploads scene to IPFS.")
    .action(function (args, callback) {
    this.log("upload");
    callback();
});
exports.cli.delimiter(exports.DELIMITER);
if (process.argv.length > 2) {
    exports.cli.parse(process.argv);
}
else {
    exports.cli.log(`DCL CLI v${exports.VERSION}\n`);
    exports.cli.log("Welcome to the Decentraland command line tool!");
    exports.cli.log('Type "exit" to quit, "help" for a list of commands.\n');
}
