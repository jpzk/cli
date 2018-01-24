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
const ipfsAPI = require('ipfs-api');
const get_root_1 = require("./get-root");
function uploader(vorpal, args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const ipfsApi = ipfsAPI('localhost', args.options.port || '5001');
        const path = get_root_1.getRoot();
        const isDclProject = yield fs.pathExists(`${path}/scene.json`);
        if (!isDclProject) {
            vorpal.log(`Seems like this is not a Decentraland project! ${chalk_1.default.grey('(\'scene.json\' not found.)')}`);
            callback();
        }
        const data = [
            {
                path: `tmp/scene.html`,
                content: new Buffer(fs.readFileSync(`${path}/scene.html`))
            },
            {
                path: `tmp/scene.json`,
                content: new Buffer(fs.readFileSync(`${path}/scene.json`))
            }
        ];
        ['audio', 'models', 'textures'].forEach((type) => __awaiter(this, void 0, void 0, function* () {
            const folder = yield fs.readdir(`${path}/${type}`);
            folder.forEach((name) => data.push({
                path: `tmp/${type}/${name}`,
                content: new Buffer(fs.readFileSync(`${path}/${type}/${name}`))
            }));
        }));
        let progCount = 0;
        let accumProgress = 0;
        const handler = (p) => {
            progCount += 1;
            accumProgress += p;
        };
        let ipfsHash;
        let ipnsHash;
        try {
            const filesAdded = yield ipfsApi.files.add(data, {
                progress: handler,
                recursive: true
            });
            const rootFolder = filesAdded[filesAdded.length - 1];
            ipfsHash = `/ipfs/${rootFolder.hash}`;
            vorpal.log('');
            vorpal.log(`Uploading ${progCount}/${progCount} files to IPFS. done! ${accumProgress} bytes uploaded.`);
            vorpal.log(`IPFS Folder Hash: ${ipfsHash}`);
            vorpal.log('Updating IPNS reference to folder hash... (this might take a while)');
            const publishResult = yield ipfsApi.name.publish(ipfsHash);
            ipnsHash = publishResult.name || publishResult.Name;
            vorpal.log(`IPNS Link: /ipns/${publishResult.name || publishResult.Name}`);
            yield fs.outputFile(`${path}/.decentraland/ipns`, ipnsHash);
        }
        catch (err) {
            vorpal.log(err.message);
        }
        return ipnsHash;
    });
}
exports.uploader = uploader;
