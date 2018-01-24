"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const cli_path_1 = require("./cli-path");
const get_root_1 = require("./get-root");
function isOutdated() {
    const path = get_root_1.getRoot();
    const localHash = fs.readdirSync(`${path}/.decentraland/linker-app/_next`);
    const latestHash = fs.readdirSync(`${cli_path_1.cliPath}/dist/linker-app/_next`);
    return localHash.sort()[0] !== latestHash.sort()[0];
}
exports.isOutdated = isOutdated;
