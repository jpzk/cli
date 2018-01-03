"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function default_1(args) {
    return new Promise((resolve, reject) => {
        console.log("Starting local development server for Decentraland scene...");
        child_process_1.exec(`budo --host 0.0.0.0 --port 4444 --live --open`, (error, response) => {
            if (error) {
                return reject(error);
            }
            resolve(response);
        });
    });
}
exports.default = default_1;
