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
const cli_path_1 = require("../utils/cli-path");
const wrap_async_1 = require("../utils/wrap-async");
const is_outdated_1 = require("../utils/is-outdated");
const get_root_1 = require("../utils/get-root");
function upgrade(vorpal) {
    vorpal
        .command('upgrade')
        .description('Get latest version of Ethereum linker.')
        .action(wrap_async_1.wrapAsync(function (args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = get_root_1.getRoot();
            const isDclProject = yield fs.pathExists(`${path}/scene.json`);
            if (!isDclProject) {
                vorpal.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
                callback();
                return;
            }
            if (is_outdated_1.isOutdated()) {
                yield fs.remove(`${path}/.decentraland/linker-app`);
                yield fs.copy(`${cli_path_1.cliPath}/dist/linker-app`, `${path}/.decentraland/linker-app`);
                vorpal.log(chalk_1.default.green('Ethereum linker app updated!'));
            }
            else {
                vorpal.log('You have the latest version of Ethereum linker app.');
            }
            callback();
            return;
        });
    }));
}
exports.upgrade = upgrade;
