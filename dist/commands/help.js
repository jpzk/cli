"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function help(vorpal) {
    removeDefaultHelp(vorpal);
    vorpal
        .command('help [command...]')
        .description('Provides help for a given command.')
        .action(function (args, callback) {
        if (args.command) {
            showHelp(vorpal, args.command.join(' '));
        }
        else {
            const oldCommands = vorpal.commands;
            const fullCommands = ['init', 'start', 'upload', 'link', 'push', 'upgrade', 'help'];
            vorpal.commands = fullCommands.map((commandName) => oldCommands.find((command) => command._name === commandName));
            this.log(vorpal._commandHelp());
            vorpal.commands = oldCommands;
        }
        callback();
    });
}
exports.help = help;
function removeDefaultHelp(vorpal) {
    const help = vorpal.find('help');
    if (help) {
        help.remove();
    }
}
function showHelp(vorpal, commandName) {
    commandName = commandName.toLowerCase().trim();
    const command = vorpal.commands.find((command) => command._name === commandName);
    if (command && !command._hidden) {
        if (typeof command._help === 'function') {
            command._help(commandName, (str) => vorpal.log(str));
        }
        else {
            vorpal.log(command.helpInformation());
        }
    }
}
