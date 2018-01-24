"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_dev_1 = require("./is-dev");
exports.getRoot = () => is_dev_1.isDev ? './tmp' : '.';
