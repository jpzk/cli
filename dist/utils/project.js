"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dockerNames = require("docker-names");
function getDefaultName() {
    return 'dcl-app';
}
exports.getDefaultName = getDefaultName;
function getRandomName() {
    return dockerNames.getRandomName();
}
exports.getRandomName = getRandomName;
