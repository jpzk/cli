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
const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const is_dev_1 = require("./is-dev");
const prompt_1 = require("./prompt");
exports.default = (args, vorpal, callback) => __awaiter(this, void 0, void 0, function* () {
    let projectName = 'dcl-app';
    if (is_dev_1.default) {
        projectName = yield prompt_1.prompt(vorpal, '(Development-mode) Project name you want to upload: ', projectName);
    }
    const root = is_dev_1.default ? `tmp/${projectName}` : '.';
    const isDclProject = yield fs.pathExists(`${root}/scene.json`);
    if (!isDclProject) {
        vorpal.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
        callback();
        return;
    }
    const hasLinker = yield fs.pathExists(`${root}/.decentraland/linker-app/linker/index.html`);
    if (!hasLinker) {
        vorpal.log(`Looks like linker app is missing. Try to re-initialize your project.`);
        callback();
        return;
    }
    vorpal.log(chalk_1.default.blue('\nConfiguring linking app...\n'));
    const app = new Koa();
    const router = new Router();
    app.use(serve(`${root}/.decentraland/linker-app`));
    router.get('/api/get-scene-data', (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = yield fs.readJson(`${root}/scene.json`);
    }));
    router.get('/api/get-ipns-hash', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const ipnsHash = yield fs.readFile(`${root}/.decentraland/ipns`, 'utf8');
        ctx.body = JSON.stringify(ipnsHash);
    }));
    router.get('*', (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.respond = false;
    }));
    app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        ctx.res.statusCode = 200;
        yield next();
    }));
    app.use(router.routes());
    vorpal.log('Linking app ready.');
    vorpal.log(`Please proceed to ${chalk_1.default.blue('http://localhost:4044/linker')}.`);
    yield app.listen(4044);
});
