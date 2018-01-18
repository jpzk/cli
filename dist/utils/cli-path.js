"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { getInstalledPathSync } = require('get-installed-path');
exports.cliPath = getInstalledPathSync('dcl-cli');
