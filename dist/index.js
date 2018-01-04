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
    .command("init")
    .description("Generates new Decentraland scene.")
    .option("-p, --path <path>", "Output path (default is the current working directory).")
    .option("--with-sample", "Include sample scene.")
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        const sceneMeta = {};
        yield self.prompt([{
                type: "input",
                name: "name",
                default: 'dcl-app',
                message: chalk_1.default.blue("Project name: ")
            }]).then((results) => {
            sceneMeta.name = results.name;
            self.log('');
            self.log(chalk_1.default.blue(JSON.stringify(sceneMeta, null, 2)));
        });
        yield self.prompt([{
                type: "confirm",
                name: "continue",
                default: false,
                message: chalk_1.default.yellow("\nDo you want to continue?")
            }]).then((results) => {
            if (!results.continue) {
                callback();
            }
        });
        let path;
        if (args.options.path && args.options.path === '.') {
            path = args.options.path;
        }
        else {
            path = args.options.path ? `${args.options.path}/${sceneMeta.name}` : sceneMeta.name;
        }
        const dirName = exports.isDev ? `tmp/${path}` : `${path}`;
        fs.ensureDirSync(`${dirName}/audio`);
        fs.ensureDirSync(`${dirName}/gltf`);
        fs.ensureDirSync(`${dirName}/obj`);
        fs.ensureDirSync(`${dirName}/scripts`);
        fs.ensureDirSync(`${dirName}/textures`);
        self.log(`New project created in '${dirName}' directory.`);
        function createScene(path, html, withSampleScene) {
            return __awaiter(this, void 0, void 0, function* () {
                yield fs.outputFile(`${path}/scene.html`, html)
                    .then(() => {
                    if (withSampleScene) {
                        self.log(`Sample scene was placed into ${chalk_1.default.green("scene.html")}.`);
                    }
                })
                    .catch((err) => {
                    self.log(err.message);
                });
            });
        }
        if (args.options["with-sample"]) {
            const html = generate_html_1.default({ withSampleScene: true });
            yield createScene(dirName, html, true);
        }
        else {
            yield self.prompt({
                type: "confirm",
                name: "sampleScene",
                default: false,
                message: chalk_1.default.yellow("Do you want to create new project with sample scene?\n")
            }).then((results) => __awaiter(this, void 0, void 0, function* () {
                if (!results.sampleScene) {
                    const html = generate_html_1.default({ withSampleScene: false });
                    yield createScene(dirName, html, false);
                }
                else {
                    const html = generate_html_1.default({ withSampleScene: true });
                    yield createScene(dirName, html, true);
                }
            }));
        }
    });
});
cli
    .command("start")
    .alias("run")
    .description("Starts local development server.")
    .action(function (args, callback) {
    start_server_1.default.bind(cli)(args, this, callback);
});
cli
    .command("upload")
    .description("Uploads scene to IPFS.")
    .action(function (args, callback) {
    this.log("Not implemented.");
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
