"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const vorpal = require("vorpal");
const mkdirp = require("mkdirp");
const start_server_1 = require("./utils/start-server");
const pkg = require("../package.json");
exports.VERSION = pkg.version;
exports.DELIMITER = "dcl-cli$";
exports.isDev = process.argv[1].indexOf("index") !== -1 || process.argv[1].indexOf("dev") !== -1;
const cli = vorpal();
cli
    .command("init [name]")
    .description("Generates new Decentraland scene.")
    .option("-f, --force", "Force file overwrites.")
    .option("-p, --path <path>", "Output path (default is the current working directory).")
    .option("--with-sample", "Include sample scene.")
    .action(function (args, callback) {
    const self = this;
    const dirName = exports.isDev ? `tmp/${args.options.path}/${args.name}` : `${args.options.path}/${args.name}`;
    function createDirFromTemplate(path) {
        mkdirp(path, (err) => {
            if (err)
                self.log(err.message);
            else
                self.log(`New project created in '${path}' directory.`);
        });
    }
    const questions = [];
    if (!args.options.force && fs.existsSync(path.resolve(dirName))) {
        questions.push({
            type: "confirm",
            name: "continue",
            default: false,
            message: chalk_1.default.yellow("Folder already exists. Overwrite its contents?")
        });
    }
    if (!args.options["with-sample"]) {
        questions.push({
            type: "confirm",
            name: "sampleScene",
            default: false,
            message: chalk_1.default.yellow("Do you want to create new project with sample scene?")
        });
    }
    if (questions.length > 0) {
        self.prompt(questions)
            .then((results) => {
            if (!!results.continue) {
                self.log("stop");
                callback();
            }
            self.log("continue");
            if (!!results.sampleScene) {
                createDirFromTemplate(dirName);
            }
            else {
                self.log("[not yet implemented] create project from template WITH sample scene");
                callback();
            }
        });
    }
    else {
        self.log("[not yet implemented] create project from template WITH sample scene");
        callback();
    }
});
cli
    .command("start")
    .alias("run")
    .description("Starts local development server.")
    .action(function (args, callback) {
    const self = this;
    start_server_1.default
        .bind(cli)(args)
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
cli
    .command("upload")
    .description("Uploads scene to IPFS.")
    .action(function (args, callback) {
    this.log("upload");
    callback();
});
cli.delimiter(exports.DELIMITER).show();
if (process.argv.length > 2) {
    cli.parse(process.argv);
}
else {
    cli.log(`DCL CLI v${exports.VERSION}\n`);
    cli.log("Welcome to the Decentraland command line tool!");
    cli.log('Type "exit" to quit, "help" for a list of commands.\n');
}
module.exports = cli;
