/**
 * Decentraland CLI.
 *
 * Command line tool for parcel management.
 */

// Use custom vorpal type definitions until there's official one
/// <reference path="../typings/vorpal.d.ts" />
/// <reference path="../typings/dcl.d.ts" />

import chalk from "chalk";
import fs = require("fs-extra");
import path = require("path");
import ProgressBar = require("progress");
import vorpal = require("vorpal");
const IPFS = require('ipfs');
import start from "./utils/start-server";
import generateHtml from "./utils/generate-html";
const pkg = require("../package.json");

/**
 * Export the current version.
 */
export const VERSION = pkg.version;

/**
 * CLI delimiter.
 */
export const DELIMITER = "dcl-cli$";

/**
 * Check if CLI is used in development mode.
 */
export const isDev = process.argv[1].indexOf("index") !== -1 || process.argv[1].indexOf("dev") !== -1;

/**
 * CLI instance.
 */
const cli = vorpal();

/**
 * `init` command for generating new Decentraland scene.
 */
cli
  .command("init")
  .description("Generates new Decentraland scene.")
  .option(
    "-p, --path <path>",
    "Output path (default is the current working directory)."
  )
  .option("--with-sample", "Include sample scene.")
  .action(async function(args: any, callback: () => void) {
    const self = this;

    await fs.access('./scene.json', fs.constants.F_OK | fs.constants.R_OK, (err: Error) => {
      if (!err) {
        self.log("Project already exists!")
        callback()
      }
    })

    let sceneMeta: DCL.SceneMetadata = {
      display: {
        title: "My Land",
        favicon: "favicon_asset"
      },
      owner: "",
      contact: {
        name: "",
        email: ""
      },
      main: "scene",
      tags: [],
      scene: {
        base: "",
        parcels: []
      },
      communications: {
        type: "webrtc",
        signalling: "https://signalling-01.decentraland.org"
      },
      policy: {
        contentRating: "E",
        fly: "yes",
        voiceEnabled: "yes",
        blacklist: [],
        teleportPosition: ""
      }
    };

    self.log(chalk.blue("Project information:"))

    await self.prompt({
      type: "input",
      name: "title",
      default: "dcl-app",
      message: chalk.blue(" project title: ")
    }).then((res: any) => sceneMeta.display.title = res.title)

    self.log(chalk.blue("Contact information:"))

    await self.prompt({
      type: "input",
      name: "owner",
      default: "",
      message: chalk.blue(" your MetaMask address: ")
    }).then((res: any) => sceneMeta.owner = res.owner)

    await self.prompt({
      type: "input",
      name: "name",
      default: "",
      message: chalk.blue(" your name: ")
    }).then((res: any) => sceneMeta.contact.name = res.name)

    await self.prompt({
      type: "input",
      name: "email",
      default: "",
      message: chalk.blue(" your email: ")
    }).then((res: any) => sceneMeta.contact.email = res.email)

    self.log(chalk.blue("Communications:"))

    await self.prompt({
      type: "input",
      name: "type",
      default: "webrtc",
      message: chalk.blue(" type: ")
    }).then((res: any) => sceneMeta.communications.type = res.type)

    await self.prompt({
      type: "input",
      name: "signalling",
      default: "https://signalling-01.decentraland.org",
      message: chalk.blue(" signalling server: ")
    }).then((res: any) => sceneMeta.communications.signalling = res.fly)

    self.log(chalk.blue("Policy:"))

    await self.prompt({
      type: "input",
      name: "contentRating",
      default: "E",
      message: chalk.blue(" content rating: ")
    }).then((res: any) => sceneMeta.policy.contentRating = res.contentRating)

    await self.prompt({
      type: "input",
      name: "fly",
      default: "yes",
      message: chalk.blue(" fly enabled: ")
    }).then((res: any) => sceneMeta.policy.fly = res.fly)

    await self.prompt({
      type: "input",
      name: "voiceEnabled",
      default: "yes",
      message: chalk.blue(" voice enabled: ")
    }).then((res: any) => sceneMeta.policy.voiceEnabled = res.voiceEnabled)

    self.log("")
    self.log(`Scene metadata: (${chalk.grey("scene.json")})`)
    self.log("")
    self.log(chalk.blue(JSON.stringify(sceneMeta, null, 2)));
    self.log("")

    await self.prompt([{
      type: "confirm",
      name: "continue",
      default: false,
      message: chalk.yellow("Do you want to continue?")
    }]).then((results: any) => {
      if (!results.continue) {
        callback()
      }
    })

    let projectDir
    if (args.options.path && args.options.path === '.') {
      projectDir = args.options.path
    } else {
      projectDir = args.options.path ? `${args.options.path}/${sceneMeta.display.title}` : sceneMeta.display.title
    }

    const dirName = isDev ? `tmp/${projectDir}` : `${projectDir}`

    // Project folder
    fs.ensureDirSync(`${dirName}/audio`)
    fs.ensureDirSync(`${dirName}/gltf`)
    fs.ensureDirSync(`${dirName}/obj`)
    fs.ensureDirSync(`${dirName}/scripts`)
    fs.ensureDirSync(`${dirName}/textures`)
    fs.outputFileSync(`${dirName}/scene.json`, JSON.stringify(sceneMeta, null, 2))
    self.log(`\nNew project created in '${dirName}' directory.\n`)

    async function createScene(dirName: string, html: string, withSampleScene?: boolean) {
      await fs.outputFile(`${dirName}/scene.html`, html)
        .then(() => {
          if (withSampleScene) {
            self.log(`\nSample scene was placed into ${chalk.green("scene.html")}.`)
          }
        })
        .catch((err: Error) => {
          self.log(err.message)
        })
    }

    if (args.options["with-sample"]) {
      const html = generateHtml({withSampleScene: true})
      await createScene(dirName, html, true)
    } else {
      await self.prompt({
        type: "confirm",
        name: "sampleScene",
        default: false,
        message: chalk.yellow("Do you want to create new project with sample scene?")
      }).then(async (results: any) => {
        if (!results.sampleScene) {
          const html = generateHtml({withSampleScene: false})
          await createScene(dirName, html, false)
        } else {
          const html = generateHtml({withSampleScene: true})
          await createScene(dirName, html, true)
        }
      })
    }
  });

/**
 * `start` command for starting local development server.
 */
cli
  .command("start")
  .alias("run")
  .description("Starts local development server.")
  .action(function(args: string, callback: () => void) {
    start.bind(cli)(args, this, callback)
  });

/**
 * `upload` command for uploading scene to IPFS.
 */
cli
  .command("upload")
  .description("Uploads scene to IPFS.")
  .action(function(args: string, callback: () => void) {
    const self = this;
    self.log("")
    self.log(chalk.yellow("Starting IPFS node..."))
    self.log("")
    // Create the IPFS node instance
    const ipfs = new IPFS()
    ipfs.on('ready', async () => {
      let projectName = "dcl-app"
      if (isDev) {
        await self.prompt({
          type: "input",
          name: "projectName",
          default: "dcl-app",
          message: "(Development-mode) Project name you want to upload: "
        }).then((res: any) => projectName = res.projectName)
      }

      const root = isDev ? `tmp/${projectName}` : "."

      await fs.access(`${root}/scene.json`, fs.constants.F_OK | fs.constants.R_OK, (err: Error) => {
        if (err) {
          self.log(`Seems like this is not a Decentraland project! ${chalk.grey("('scene.json' not found.)")}`)
          callback()
        }
      })

      const data = [{
        path: `tmp/scene.html`,
        content: new Buffer(fs.readFileSync(`${root}/scene.html`))
      },{
        path: `tmp/scene.json`,
        content: new Buffer(fs.readFileSync(`${root}/scene.json`))
      }]

      // Go through project folders and add files if available
      await fs.readdir(`${root}/audio`).then(files => files.forEach(name => data.push({path: `tmp/audio/${name}`, content: new Buffer(fs.readFileSync(`${root}/audio/${name}`))})))
      await fs.readdir(`${root}/gltf`).then(files => files.forEach(name => data.push({path: `tmp/gltf/${name}`, content: new Buffer(fs.readFileSync(`${root}/gltf/${name}`))})))
      await fs.readdir(`${root}/obj`).then(files => files.forEach(name => data.push({path: `tmp/obj/${name}`, content: new Buffer(fs.readFileSync(`${root}/obj/${name}`))})))
      await fs.readdir(`${root}/scripts`).then(files => files.forEach(name => data.push({path: `tmp/scripts/${name}`, content: new Buffer(fs.readFileSync(`${root}/scripts/${name}`))})))
      await fs.readdir(`${root}/textures`).then(files => files.forEach(name => data.push({path: `tmp/textures/${name}`, content: new Buffer(fs.readFileSync(`${root}/textures/${name}`))})))

      let progCount = 0
      let accumProgress = 0
      const handler = (p) => {
        progCount += 1
        accumProgress += p
        //self.log(`${progCount}, ${accumProgress}`)
      }

      await ipfs.files.add(data, { progress: handler, recursive: true }, (err, filesAdded) => {
        if (err) {
          self.log(err.message)
          callback()
        }

        const rootFolder = filesAdded[filesAdded.length - 1]
        self.log("")
        self.log(`Uploading ${progCount}/${progCount} files to IPFS. done! ${accumProgress} bytes uploaded.`)
        self.log(`IPFS Folder Hash: /ipfs/${rootFolder.hash}`)

        //TODO: implement IPNS update
        //TODO: pinning --- ipfs.pin.add(hash, function (err) {})

        callback()
      })
    });
  });

cli.delimiter(DELIMITER).show();

// If one or more command, execute and close
if (process.argv.length > 2) {
  cli.parse(process.argv);
} else {
  // Enters immersive mode if no commands supplied
  cli.log(`DCL CLI v${VERSION}\n`);
  cli.log("Welcome to the Decentraland command line tool!");
  cli.log('Type "exit" to quit, "help" for a list of commands.\n');
}

module.exports = cli
