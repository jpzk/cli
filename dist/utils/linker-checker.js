"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs-extra");
const is_outdated_1 = require("./is-outdated");
const get_root_1 = require("./get-root");
function linkerChecker(vorpal) {
    const path = get_root_1.getRoot();
    const isDclProject = fs.pathExistsSync(`${path}/scene.json`);
    if (!isDclProject || process.argv[2].indexOf('upgrade') !== -1 || !is_outdated_1.isOutdated()) {
        return;
    }
    vorpal.log(`${chalk_1.default.red('Ethereum linker app is outdated! Please run ')}${chalk_1.default.yellow('dcl upgrade')}${chalk_1.default.red('!')}\n`);
}
exports.linkerChecker = linkerChecker;
