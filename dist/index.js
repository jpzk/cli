"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vorpal = require("vorpal");
const help_1 = require("./commands/help");
const init_1 = require("./commands/init");
const link_1 = require("./commands/link");
const push_1 = require("./commands/push");
const start_1 = require("./commands/start");
const upload_1 = require("./commands/upload");
const pkg = require('../package.json');
exports.VERSION = pkg.version;
exports.DELIMITER = 'dcl $';
exports.vorpal = new Vorpal();
const cli = {
    vorpal: exports.vorpal,
    init(options = {}) {
        exports.vorpal.use(init_1.init);
        exports.vorpal.use(start_1.start);
        exports.vorpal.use(upload_1.upload);
        exports.vorpal.use(link_1.link);
        exports.vorpal.use(push_1.push);
        exports.vorpal.use(help_1.help);
        exports.vorpal
            .delimiter(exports.DELIMITER)
            .catch('[words...]', 'Catches incorrect commands')
            .action(() => {
            exports.vorpal.execSync('help');
        });
        if (process.argv.length > 2) {
            exports.vorpal.parse(process.argv);
        }
        else {
            exports.vorpal.log(`Decentraland CLI v${exports.VERSION}\n`);
            exports.vorpal.exec('help');
        }
    }
};
module.exports = cli;
