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
const axios_1 = require("axios");
const decentraland_commons_1 = require("decentraland-commons");
const opn = require("opn");
const get_root_1 = require("./get-root");
function linker(vorpal, args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = get_root_1.getRoot();
        const isDclProject = yield fs.pathExists(`${path}/scene.json`);
        if (!isDclProject) {
            vorpal.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
            callback();
            return;
        }
        const hasLinker = yield fs.pathExists(`${path}/.decentraland/linker-app/linker/index.html`);
        if (!hasLinker) {
            vorpal.log(`Looks like linker app is missing. Try to re-initialize your project.`);
            callback();
            return;
        }
        vorpal.log(chalk_1.default.blue('\nConfiguring linking app...\n'));
        decentraland_commons_1.env.load();
        const app = new Koa();
        const router = new Router();
        app.use(serve(`${path}/.decentraland/linker-app`));
        router.get('/api/get-scene-data', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield fs.readJson(`${path}/scene.json`);
        }));
        router.get('/api/get-ipns-hash', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const ipnsHash = yield fs.readFile(`${path}/.decentraland/ipns`, 'utf8');
            ctx.body = JSON.stringify(ipnsHash);
        }));
        router.get('/api/contract-address', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let LANDRegistryAddress = null;
            try {
                const { data } = yield axios_1.default.get('https://contracts.decentraland.org/addresses.json');
                LANDRegistryAddress = data.mainnet.LANDRegistry;
            }
            catch (error) {
            }
            LANDRegistryAddress = decentraland_commons_1.env.get('LAND_REGISTRY_CONTRACT_ADDRESS', () => LANDRegistryAddress);
            ctx.body = JSON.stringify({
                address: LANDRegistryAddress
            });
        }));
        router.get('/api/close', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.res.end();
            const ok = require('url').parse(ctx.req.url, true).query.ok;
            if (ok === 'true') {
                vorpal.log(chalk_1.default.green('\nThe project was linked to Ethereum!'));
            }
            else {
                vorpal.log(chalk_1.default.red('\nThe project was not linked to Ethereum'));
            }
            process.exit(0);
        }));
        router.get('*', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.respond = false;
        }));
        app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            ctx.res.statusCode = 200;
            yield next();
        }));
        app.use(router.routes());
        const url = 'http://localhost:4044/linker';
        vorpal.log('Linking app ready.');
        vorpal.log(`Please proceed to ${chalk_1.default.blue(url)}`);
        yield app.listen(4044, () => opn(url));
    });
}
exports.linker = linker;
