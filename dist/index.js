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
const path = require("path");
const vorpal = require("vorpal");
const ipfsAPI = require('ipfs-api');
const copyfiles = require('copyfiles');
const generate_html_1 = require("./utils/generate-html");
const is_dev_1 = require("./utils/is-dev");
const linker_1 = require("./utils/linker");
const start_server_1 = require("./utils/start-server");
const prompt_1 = require("./utils/prompt");
const pkg = require('../package.json');
exports.VERSION = pkg.version;
exports.DELIMITER = 'dcl $';
exports.cli = vorpal();
const cliPath = path.resolve(__dirname, '..');
exports.cli
    .command('update-linker')
    .description('Update Ethereum linker tool.')
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        let projectName = 'dcl-app';
        if (is_dev_1.default) {
            const res = yield self.prompt({
                type: 'input',
                name: 'projectName',
                default: 'dcl-app',
                message: '(Development-mode) Project name (in \'tmp/\' folder) you want to update: '
            });
            projectName = res.projectName;
            const isDclProject = yield fs.pathExists(`tmp/${projectName}/scene.json`);
            if (!isDclProject) {
                self.log(`Seems like that is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
                callback();
            }
            yield fs.copy(`${cliPath}/dist/linker-app`, `tmp/${projectName}/.decentraland/linker-app`);
        }
        else {
            const isDclProject = yield fs.pathExists('./scene.json');
            if (!isDclProject) {
                self.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
                callback();
            }
            yield fs.copy(`${cliPath}/dist/linker-app`, './.decentraland/linker-app');
            self.log('CLI linking app updated!');
        }
    });
});
exports.cli
    .command('init')
    .description('Generates new Decentraland scene.')
    .option('-p, --path <path>', 'Output path (default is the current working directory).')
    .option('--boilerplate', 'Include sample scene.')
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        const isDclProject = yield fs.pathExists('./scene.json');
        if (isDclProject) {
            self.log('Project already exists!');
            callback();
        }
        const sceneMeta = {
            display: {
                title: 'My Land',
                favicon: 'favicon_asset'
            },
            owner: '',
            contact: {
                name: '',
                email: ''
            },
            main: 'scene',
            tags: [],
            scene: {
                base: '',
                parcels: []
            },
            communications: {
                type: 'webrtc',
                signalling: 'https://signalling-01.decentraland.org'
            },
            policy: {
                contentRating: 'E',
                fly: 'yes',
                voiceEnabled: 'yes',
                blacklist: [],
                teleportPosition: ''
            }
        };
        self.log(chalk_1.default.blue('Project information:'));
        sceneMeta.display.title = yield prompt_1.prompt(self, chalk_1.default.blue(' project title: '), 'dcl-app');
        const tags = yield prompt_1.prompt(self, chalk_1.default.blue(' tags: '), '');
        sceneMeta.tags = tags
            ? tags
                .split(',')
                .map(tag => tag.replace(/\s/g, ''))
                .filter(tag => tag.length > 0)
            : [];
        self.log(chalk_1.default.blue('Contact information:'));
        sceneMeta.owner = yield prompt_1.prompt(self, chalk_1.default.blue(' your MetaMask address: '));
        sceneMeta.contact.name = yield prompt_1.prompt(self, chalk_1.default.blue(' your name: '));
        sceneMeta.contact.email = yield prompt_1.prompt(self, chalk_1.default.blue(' your email: '));
        self.log(chalk_1.default.blue('Scene information:'));
        self.log(' (use the format: \'x,y; x,y; x,y\')');
        const parcels = yield prompt_1.prompt(self, chalk_1.default.blue(' parcels: '));
        sceneMeta.scene.parcels = parcels
            ? parcels.split(';').map((coord) => coord.replace(/\s/g, ''))
            : [];
        if (sceneMeta.scene.parcels.length > 0) {
            sceneMeta.scene.base = yield prompt_1.prompt(self, chalk_1.default.blue(' base: '), sceneMeta.scene.parcels[0] || '');
        }
        self.log(chalk_1.default.blue('Communications:'));
        sceneMeta.communications.type = yield prompt_1.prompt(self, chalk_1.default.blue(' type: '), 'webrtc');
        sceneMeta.communications.signalling = yield prompt_1.prompt(self, chalk_1.default.blue(' signalling server: '), 'https://signalling-01.decentraland.org');
        self.log(chalk_1.default.blue('Policy:'));
        sceneMeta.policy.contentRating = yield prompt_1.prompt(self, chalk_1.default.blue(' content rating: '), 'E');
        sceneMeta.policy.fly = yield prompt_1.prompt(self, chalk_1.default.blue(' fly enabled: '), 'yes');
        sceneMeta.policy.voiceEnabled = yield prompt_1.prompt(self, chalk_1.default.blue(' voice enabled: '), 'yes');
        self.log('');
        self.log(`Scene metadata: (${chalk_1.default.grey('scene.json')})`);
        self.log('');
        self.log(chalk_1.default.blue(JSON.stringify(sceneMeta, null, 2)));
        self.log('');
        const results = yield self.prompt([
            {
                type: 'confirm',
                name: 'continue',
                default: true,
                message: chalk_1.default.yellow('Do you want to continue?')
            }
        ]);
        if (!results.continue) {
            callback();
            return;
        }
        let projectDir;
        if (args.options.path && args.options.path === '.') {
            projectDir = args.options.path;
        }
        else {
            projectDir = args.options.path
                ? `${args.options.path}/${sceneMeta.display.title}`
                : sceneMeta.display.title;
        }
        const dirName = is_dev_1.default ? `tmp/${projectDir}` : `${projectDir}`;
        fs.copySync(`${cliPath}/dist/linker-app`, `${dirName}/.decentraland/linker-app`);
        fs.ensureDirSync(`${dirName}/audio`);
        fs.ensureDirSync(`${dirName}/models`);
        fs.ensureDirSync(`${dirName}/textures`);
        fs.outputFileSync(`${dirName}/scene.json`, JSON.stringify(sceneMeta, null, 2));
        self.log(`\nNew project created in '${dirName}' directory.\n`);
        function createScene(pathToProject, html, withSampleScene) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield fs.outputFile(`${pathToProject}/scene.html`, html);
                    if (withSampleScene) {
                        self.log(`\nSample scene was placed into ${chalk_1.default.green('scene.html')}.`);
                    }
                }
                catch (err) {
                    self.log(err.message);
                }
            });
        }
        if (args.options.boilerplate) {
            const html = generate_html_1.default({ withSampleScene: true });
            yield createScene(dirName, html, true);
        }
        else {
            const results = yield self.prompt({
                type: 'confirm',
                name: 'sampleScene',
                default: true,
                message: chalk_1.default.yellow('Do you want to create new project with sample scene?')
            });
            if (!results.sampleScene) {
                const html = generate_html_1.default({ withSampleScene: false });
                yield createScene(dirName, html, false);
            }
            else {
                const html = generate_html_1.default({ withSampleScene: true });
                yield createScene(dirName, html, true);
            }
        }
    });
});
exports.cli
    .command('start')
    .alias('serve')
    .description('Starts local development server.')
    .action(function (args, callback) {
    start_server_1.default.bind(exports.cli)(args, this, callback);
});
exports.cli
    .command('upload')
    .description('Uploads scene to IPFS and updates IPNS.')
    .option('-p, --port <number>', 'IPFS daemon API port (default is 5001).')
    .action(function (args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        const ipfsApi = ipfsAPI('localhost', args.options.port || '5001');
        let projectName = 'dcl-app';
        if (is_dev_1.default) {
            yield self
                .prompt({
                type: 'input',
                name: 'projectName',
                default: 'dcl-app',
                message: '(Development-mode) Project name you want to upload: '
            })
                .then((res) => (projectName = res.projectName));
        }
        const root = is_dev_1.default ? `tmp/${projectName}` : '.';
        const isDclProject = yield fs.pathExists(`${root}/scene.json`);
        if (!isDclProject) {
            self.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
            callback();
        }
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
        yield fs.readdir(`${root}/audio`).then(files => files.forEach(name => data.push({
            path: `tmp/audio/${name}`,
            content: new Buffer(fs.readFileSync(`${root}/audio/${name}`))
        })));
        yield fs.readdir(`${root}/models`).then(files => files.forEach(name => data.push({
            path: `tmp/models/${name}`,
            content: new Buffer(fs.readFileSync(`${root}/models/${name}`))
        })));
        yield fs.readdir(`${root}/textures`).then(files => files.forEach(name => data.push({
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
        try {
            const filesAdded = yield ipfsApi.files.add(data, {
                progress: handler,
                recursive: true
            });
            const rootFolder = filesAdded[filesAdded.length - 1];
            ipfsHash = `/ipfs/${rootFolder.hash}`;
            self.log('');
            self.log(`Uploading ${progCount}/${progCount} files to IPFS. done! ${accumProgress} bytes uploaded.`);
            self.log(`IPFS Folder Hash: ${ipfsHash}`);
            self.log('Updating IPNS reference to folder hash... (this might take a while)');
            const publishResult = yield ipfsApi.name.publish(ipfsHash);
            const ipnsHash = publishResult.name || publishResult.Name;
            self.log(`IPNS Link: /ipns/${publishResult.name || publishResult.Name}`);
            yield fs.outputFile(`${root}/.decentraland/ipns`, ipnsHash);
        }
        catch (err) {
            self.log(err.message);
        }
        callback();
    });
});
exports.cli
    .command('link')
    .description('Link scene to Ethereum.')
    .action(function (args, callback) {
    const self = this;
    linker_1.default.bind(exports.cli)(args, this, callback);
});
exports.cli.delimiter(exports.DELIMITER).show();
if (process.argv.length > 2) {
    exports.cli.parse(process.argv);
}
else {
    exports.cli.log(`Decentraland CLI v${exports.VERSION}\n`);
    exports.cli.log('Type "exit" to quit, "help" for a list of commands.\n');
}
module.exports = exports.cli;
