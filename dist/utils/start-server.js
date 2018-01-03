"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const child_process_1 = require("child_process");
function default_1(args) {
    return new Promise((resolve, reject) => {
        console.log('Starting local development server for Decentraland scene...');
        console.log(path.resolve('.'));
        console.log(args);
        child_process_1.exec(`budo --host 0.0.0.0 --port 4444 --live --open`, (error, response) => {
            console.log("ide");
            if (error) {
                return reject(error);
            }
            resolve(response);
        });
    });
}
exports.default = default_1;
