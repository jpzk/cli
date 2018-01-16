"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDev = process.argv[1].indexOf('index') !== -1 ||
    process.argv[1].indexOf('dev') !== -1;
exports.default = isDev;
