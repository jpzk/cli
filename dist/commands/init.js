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
const inquirer = require("inquirer");
const project = require("../utils/project");
const cli_path_1 = require("../utils/cli-path");
const generate_html_1 = require("../utils/generate-html");
const wrap_async_1 = require("../utils/wrap-async");
const get_root_1 = require("../utils/get-root");
function init(vorpal) {
    vorpal
        .command('init')
        .description('Generates new Decentraland scene.')
        .option('-p, --path <path>', 'Output path (default is the current working directory).')
        .option('--boilerplate', 'Include sample scene.')
        .action(wrap_async_1.wrapAsync(function (args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDclProject = yield fs.pathExists('./scene.json');
            if (isDclProject) {
                this.log('Project already exists!');
                callback();
            }
            const sceneMeta = yield inquirer.prompt([
                { type: 'input', name: 'display.title', message: chalk_1.default.blue('Project title: '), default: project.getRandomName() },
                { type: 'input', name: 'display.favicon', message: chalk_1.default.blue('Project favicon: '), default: 'favicon_asset' },
                { type: 'input', name: 'owner', message: chalk_1.default.blue('Your MetaMask address: ') },
                { type: 'input', name: 'contact.name', message: chalk_1.default.blue('Your name: ') },
                { type: 'input', name: 'contact.email', message: chalk_1.default.blue('Your email: ') },
                { type: 'input', name: 'main', message: chalk_1.default.blue('Main: '), default: 'scene' },
                { type: 'input', name: 'tags', message: chalk_1.default.blue('Tags: ') },
                { type: 'input', name: 'scene.parcels', message: `${chalk_1.default.blue('Parcels')} ${chalk_1.default.grey('(use the format \'x,y; x,y; x,y ...\'):')} ` },
                { type: 'input', name: 'communications.type', message: chalk_1.default.blue('Communication type: '), default: 'webrtc' },
                { type: 'input', name: 'communications.signalling', message: chalk_1.default.blue('Link to signalling server: '), default: 'https://signalling-01.decentraland.org' },
                { type: 'input', name: 'policy.contentRating', message: chalk_1.default.blue('Content rating: '), default: 'E' },
                { type: 'confirm', name: 'policy.fly', message: chalk_1.default.blue('Allow flying?: '), default: true },
                { type: 'confirm', name: 'policy.voiceEnabled', message: chalk_1.default.blue('Allow voice?: '), default: true },
                { type: 'input', name: 'policy.blacklist', message: `${chalk_1.default.blue('Blacklisted parcels')} ${chalk_1.default.grey('(use the format \'x,y; x,y; x,y ...\'):')} ` },
                { type: 'input', name: 'policy.teleportPosition', message: `${chalk_1.default.blue('Teleport position')} ${chalk_1.default.grey('(use the format \'x,y\'):')} ` },
            ]);
            sceneMeta.tags = sceneMeta.tags
                ? sceneMeta.tags
                    .split(',')
                    .map((tag) => tag.replace(/\s/g, ''))
                    .filter((tag) => tag.length > 0)
                : [];
            sceneMeta.scene.parcels = sceneMeta.scene.parcels
                ? sceneMeta.scene.parcels.split(';').map((coord) => coord.replace(/\s/g, ''))
                : [];
            sceneMeta.policy.blacklist = sceneMeta.policy.blacklist
                ? sceneMeta.policy.blacklist.split(';').map((coord) => coord.replace(/\s/g, ''))
                : [];
            sceneMeta.scene.base = sceneMeta.scene.parcels[0] || '';
            this.log('');
            this.log(`Scene metadata: (${chalk_1.default.grey('scene.json')})`);
            this.log('');
            this.log(chalk_1.default.blue(JSON.stringify(sceneMeta, null, 2)));
            this.log('');
            this.log(chalk_1.default.grey('(you can always update the metadata manually later)'));
            this.log('');
            const results = yield inquirer.prompt({
                type: 'confirm',
                name: 'continue',
                default: true,
                message: chalk_1.default.yellow('Do you want to continue?')
            });
            if (!results.continue) {
                callback();
                return;
            }
            const dirName = args.options.path || get_root_1.getRoot();
            fs.copySync(`${cli_path_1.cliPath}/dist/linker-app`, `${dirName}/.decentraland/linker-app`);
            fs.copySync(`${cli_path_1.cliPath}/live-reload.js`, `${dirName}/.decentraland/live-reload.js`);
            fs.copySync(`${cli_path_1.cliPath}/parcel-boundary.js`, `${dirName}/.decentraland/parcel-boundary.js`);
            fs.ensureDirSync(`${dirName}/audio`);
            fs.ensureDirSync(`${dirName}/models`);
            fs.ensureDirSync(`${dirName}/textures`);
            fs.outputFileSync(`${dirName}/scene.json`, JSON.stringify(sceneMeta, null, 2));
            this.log(`\nNew project created in '${dirName}' directory.\n`);
            const createScene = (pathToProject, html, withSampleScene) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield fs.outputFile(`${pathToProject}/scene.html`, html);
                    if (withSampleScene) {
                        this.log(`\nSample scene was placed into ${chalk_1.default.green('scene.html')}.`);
                    }
                }
                catch (err) {
                    this.log(err.message);
                }
            });
            if (args.options.boilerplate) {
                const html = yield generate_html_1.generateHtml({ withSampleScene: true });
                yield createScene(dirName, html, true);
            }
            else {
                const results = yield inquirer.prompt({
                    type: 'confirm',
                    name: 'sampleScene',
                    default: true,
                    message: chalk_1.default.yellow('Do you want to create new project with sample scene?')
                });
                if (results.sampleScene) {
                    const html = yield generate_html_1.generateHtml({ withSampleScene: true });
                    yield createScene(dirName, html, true);
                }
                else {
                    const html = yield generate_html_1.generateHtml({ withSampleScene: false });
                    yield createScene(dirName, html, false);
                }
            }
        });
    }));
}
exports.init = init;
