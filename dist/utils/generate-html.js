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
const axios_1 = require("axios");
function generateHtml({ withSampleScene = false }) {
    return __awaiter(this, void 0, void 0, function* () {
        const sampleScene = `<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky color="#ECECEC"></a-sky>`;
        const { data } = yield axios_1.default.get('https://client.decentraland.today/assets.json');
        const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Blank Decentraland scene</title>
    <script src=".decentraland/live-reload.js"></script>
    <script charset="utf-8" src="https://client.decentraland.today${data.preview.js}"></script>
  </head>
  <body>
    <a-scene>
      ${withSampleScene ? sampleScene : '<!-- Your scene code -->'}
    </a-scene>
  </body>
  <script charset="utf-8" src=".decentraland/parcel-boundary.js"></script>
</html>`;
        return html;
    });
}
exports.generateHtml = generateHtml;
