"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs-extra");
const vorpal = require("vorpal");
const start_server_1 = require("./utils/start-server");
const generate_html_1 = require("./utils/generate-html");
const pkg = require("../package.json");
exports.VERSION = pkg.version;
exports.DELIMITER = "dcl-cli$";
exports.isDev = process.argv[1].indexOf("index") !== -1 || process.argv[1].indexOf("dev") !== -1;
const cli = vorpal();
cli
    .command("init [name]")
    .description("Generates new Decentraland scene.")
    .option("-p, --path <path>", "Output path (default is the current working directory).")
    .option("--with-sample", "Include sample scene.")
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        const dirName = exports.isDev ? `tmp/${args.options.path}/${args.name}` : `${args.options.path}/${args.name}`;
        fs.ensureDirSync(`${dirName}/audio`);
        fs.ensureDirSync(`${dirName}/gltf`);
        fs.ensureDirSync(`${dirName}/obj`);
        fs.ensureDirSync(`${dirName}/scripts`);
        fs.ensureDirSync(`${dirName}/textures`);
        self.log(`New project created in '${dirName}' directory.`);
        function createScene(path, html, withSampleScene) {
            fs.outputFile(path, html)
                .then(() => {
                if (withSampleScene) {
                    self.log(`Sample scene was placed into ${chalk_1.default.green("scene.html")}.`);
                }
            })
                .catch((err) => {
                self.log(err.message);
            });
        }
        if (args.options["with-sample"]) {
            const html = generate_html_1.default({ withSampleScene: true });
            createScene(dirName, html, true);
        }
        else {
            yield self.prompt({
                type: "confirm",
                name: "sampleScene",
                default: false,
                message: chalk_1.default.yellow("Do you want to create new project with sample scene?")
            }).then((results) => {
                self.log(results);
                if (!results.sampleScene) {
                    const html = generate_html_1.default({ withSampleScene: false });
                    createScene(dirName, html, false);
                }
                else {
                    const html = generate_html_1.default({ withSampleScene: true });
                    createScene(dirName, html, true);
                }
            });
        }
    });
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
