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
const ipfsAPI = require("ipfs-api");
const generate_html_1 = require("./utils/generate-html");
const start_server_1 = require("./utils/start-server");
const pkg = require("../package.json");
exports.VERSION = pkg.version;
exports.DELIMITER = "dcl-cli$";
exports.isDev = process.argv[1].indexOf("index") !== -1 ||
    process.argv[1].indexOf("dev") !== -1;
const cli = vorpal();
cli
    .command("init")
    .description("Generates new Decentraland scene.")
    .option("-p, --path <path>", "Output path (default is the current working directory).")
    .option("--boilerplate", "Include sample scene.")
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        yield fs.access("./scene.json", fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (!err) {
                self.log("Project already exists!");
                callback();
            }
        });
        const sceneMeta = {
            display: {
                title: "My Land",
                favicon: "favicon_asset"
            },
            owner: "",
            contact: {
                name: "",
                email: ""
            },
            main: "scene",
            tags: [],
            scene: {
                base: "",
                parcels: []
            },
            communications: {
                type: "webrtc",
                signalling: "https://signalling-01.decentraland.org"
            },
            policy: {
                contentRating: "E",
                fly: "yes",
                voiceEnabled: "yes",
                blacklist: [],
                teleportPosition: ""
            }
        };
        self.log(chalk_1.default.blue("Project information:"));
        yield self
            .prompt({
            type: "input",
            name: "title",
            default: "dcl-app",
            message: chalk_1.default.blue(" project title: ")
        })
            .then((res) => (sceneMeta.display.title = res.title));
        yield self
            .prompt({
            type: "input",
            name: "tags",
            default: "",
            message: chalk_1.default.blue(" tags: ")
        })
            .then((res) => (sceneMeta.tags = res.tags
            ? res.tags.split(",").map((tag) => tag.replace(/\s/g, ""))
            : []));
        self.log(chalk_1.default.blue("Contact information:"));
        yield self
            .prompt({
            type: "input",
            name: "owner",
            default: "",
            message: chalk_1.default.blue(" your MetaMask address: ")
        })
            .then((res) => (sceneMeta.owner = res.owner));
        yield self
            .prompt({
            type: "input",
            name: "name",
            default: "",
            message: chalk_1.default.blue(" your name: ")
        })
            .then((res) => (sceneMeta.contact.name = res.name));
        yield self
            .prompt({
            type: "input",
            name: "email",
            default: "",
            message: chalk_1.default.blue(" your email: ")
        })
            .then((res) => (sceneMeta.contact.email = res.email));
        self.log(chalk_1.default.blue("Scene information:"));
        yield self
            .prompt({
            type: "input",
            name: "parcels",
            default: "",
            message: chalk_1.default.blue(" parcels: ")
        })
            .then((res) => (sceneMeta.scene.parcels = res.parcels
            ? res.parcels
                .split(";")
                .map((coord) => coord.replace(/\s/g, ""))
            : []));
        if (sceneMeta.scene.parcels.length > 0) {
            yield self
                .prompt({
                type: "input",
                name: "base",
                default: sceneMeta.scene.parcels[0] || "",
                message: chalk_1.default.blue(" base: ")
            })
                .then((res) => (sceneMeta.scene.base = res.base));
        }
        self.log(chalk_1.default.blue("Communications:"));
        yield self
            .prompt({
            type: "input",
            name: "type",
            default: "webrtc",
            message: chalk_1.default.blue(" type: ")
        })
            .then((res) => (sceneMeta.communications.type = res.type));
        yield self
            .prompt({
            type: "input",
            name: "signalling",
            default: "https://signalling-01.decentraland.org",
            message: chalk_1.default.blue(" signalling server: ")
        })
            .then((res) => (sceneMeta.communications.signalling = res.fly));
        self.log(chalk_1.default.blue("Policy:"));
        yield self
            .prompt({
            type: "input",
            name: "contentRating",
            default: "E",
            message: chalk_1.default.blue(" content rating: ")
        })
            .then((res) => (sceneMeta.policy.contentRating = res.contentRating));
        yield self
            .prompt({
            type: "input",
            name: "fly",
            default: "yes",
            message: chalk_1.default.blue(" fly enabled: ")
        })
            .then((res) => (sceneMeta.policy.fly = res.fly));
        yield self
            .prompt({
            type: "input",
            name: "voiceEnabled",
            default: "yes",
            message: chalk_1.default.blue(" voice enabled: ")
        })
            .then((res) => (sceneMeta.policy.voiceEnabled = res.voiceEnabled));
        self.log("");
        self.log(`Scene metadata: (${chalk_1.default.grey("scene.json")})`);
        self.log("");
        self.log(chalk_1.default.blue(JSON.stringify(sceneMeta, null, 2)));
        self.log("");
        yield self
            .prompt([
            {
                type: "confirm",
                name: "continue",
                default: false,
                message: chalk_1.default.yellow("Do you want to continue?")
            }
        ])
            .then((results) => {
            if (!results.continue) {
                callback();
            }
        });
        let projectDir;
        if (args.options.path && args.options.path === ".") {
            projectDir = args.options.path;
        }
        else {
            projectDir = args.options.path
                ? `${args.options.path}/${sceneMeta.display.title}`
                : sceneMeta.display.title;
        }
        const dirName = exports.isDev ? `tmp/${projectDir}` : `${projectDir}`;
        fs.ensureDirSync(`${dirName}/audio`);
        fs.ensureDirSync(`${dirName}/models`);
        fs.ensureDirSync(`${dirName}/textures`);
        fs.outputFileSync(`${dirName}/scene.json`, JSON.stringify(sceneMeta, null, 2));
        self.log(`\nNew project created in '${dirName}' directory.\n`);
        function createScene(dirName, html, withSampleScene) {
            return __awaiter(this, void 0, void 0, function* () {
                yield fs
                    .outputFile(`${dirName}/scene.html`, html)
                    .then(() => {
                    if (withSampleScene) {
                        self.log(`\nSample scene was placed into ${chalk_1.default.green("scene.html")}.`);
                    }
                })
                    .catch((err) => {
                    self.log(err.message);
                });
            });
        }
        if (args.options.boilerplate) {
            const html = generate_html_1.default({ withSampleScene: true });
            yield createScene(dirName, html, true);
        }
        else {
            yield self
                .prompt({
                type: "confirm",
                name: "sampleScene",
                default: false,
                message: chalk_1.default.yellow("Do you want to create new project with sample scene?")
            })
                .then((results) => __awaiter(this, void 0, void 0, function* () {
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
    .description("Uploads scene to IPFS and updates IPNS.")
    .option("-p, --port <number>", "IPFS daemon API port (default is 5001).")
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        const ipfsApi = ipfsAPI("localhost", args.options.port || "5001");
        let projectName = "dcl-app";
        if (exports.isDev) {
            yield self
                .prompt({
                type: "input",
                name: "projectName",
                default: "dcl-app",
                message: "(Development-mode) Project name you want to upload: "
            })
                .then((res) => (projectName = res.projectName));
        }
        const root = exports.isDev ? `tmp/${projectName}` : ".";
        yield fs.access(`${root}/scene.json`, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                self.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey("('scene.json' not found.)")}`);
                callback();
            }
        });
        const data = [
            {
                path: `tmp/scene.html`,
                content: new Buffer(fs.readFileSync(`${root}/scene.html`))
            },
            {
                path: `tmp/scene.json`,
                content: new Buffer(fs.readFileSync(`${root}/scene.json`))
            }
        ];
        yield fs
            .readdir(`${root}/audio`)
            .then(files => files.forEach(name => data.push({
            path: `tmp/audio/${name}`,
            content: new Buffer(fs.readFileSync(`${root}/audio/${name}`))
        })));
        yield fs
            .readdir(`${root}/models`)
            .then(files => files.forEach(name => data.push({
            path: `tmp/models/${name}`,
            content: new Buffer(fs.readFileSync(`${root}/models/${name}`))
        })));
        yield fs
            .readdir(`${root}/textures`)
            .then(files => files.forEach(name => data.push({
            path: `tmp/textures/${name}`,
            content: new Buffer(fs.readFileSync(`${root}/textures/${name}`))
        })));
        let progCount = 0;
        let accumProgress = 0;
        const handler = (p) => {
            progCount += 1;
            accumProgress += p;
        };
        let ipfsHash;
        yield ipfsApi.files
            .add(data, { progress: handler, recursive: true })
            .then((filesAdded) => {
            const rootFolder = filesAdded[filesAdded.length - 1];
            ipfsHash = `/ipfs/${rootFolder.hash}`;
            self.log("");
            self.log(`Uploading ${progCount}/${progCount} files to IPFS. done! ${accumProgress} bytes uploaded.`);
            self.log(`IPFS Folder Hash: ${ipfsHash}`);
        })
            .catch((err) => {
            self.log(err.message);
            callback();
        });
        self.log("Updating IPNS reference to folder hash... (this might take a while)");
        yield ipfsApi.name
            .publish(ipfsHash)
            .then((res) => {
            self.log(`IPNS Link: /ipns/${res.Name}`);
            callback();
        })
            .catch((err) => {
            self.log(err.message);
            callback();
        });
    });
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
