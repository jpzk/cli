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
const is_dev_1 = require("../utils/is-dev");
const wrap_async_1 = require("../utils/wrap-async");
function update(vorpal) {
    vorpal
        .command('update')
        .description('Update Ethereum linker tool.')
        .action(wrap_async_1.wrapAsync(function (args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectName = project.getDefaultName();
            if (is_dev_1.isDev) {
                const res = yield inquirer.prompt({
                    type: 'input',
                    name: 'projectName',
                    default: projectName,
                    message: '(Development-mode) Project name (in \'tmp/\' folder) you want to update: '
                });
                projectName = res.projectName;
                const isDclProject = yield fs.pathExists(`tmp/${projectName}/scene.json`);
                if (!isDclProject) {
                    vorpal.log(`Seems like that is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
                    callback();
                }
                yield fs.copy(`${cli_path_1.cliPath}/dist/linker-app`, `tmp/${projectName}/.decentraland/linker-app`);
            }
            else {
                const isDclProject = yield fs.pathExists('./scene.json');
                if (!isDclProject) {
                    vorpal.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
                    callback();
                }
                yield fs.copy(`${cli_path_1.cliPath}/dist/linker-app`, './.decentraland/linker-app');
                vorpal.log('CLI linking app updated!');
            }
        });
    }));
}
exports.update = update;
