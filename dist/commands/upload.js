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
const uploader_1 = require("../utils/uploader");
const wrap_async_1 = require("../utils/wrap-async");
function upload(vorpal) {
    vorpal
        .command('upload')
        .description('Uploads scene to IPFS and updates IPNS.')
        .option('-p, --port <number>', 'IPFS daemon API port (default is 5001).')
        .action(wrap_async_1.wrapAsync(function (args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield uploader_1.uploader(vorpal, args, callback);
            callback();
        });
    }));
}
exports.upload = upload;
