"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sampleScene() {
    return `
    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
    <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
    <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
    <a-sky color="#ECECEC"></a-sky>
  `;
}
function generateHtml({ withSampleScene = false }) {
    const sceneCode = withSampleScene ? sampleScene() : '<!-- Your scene code -->';
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Blank Decentraland scene</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
      </head>
      <body>
        <a-scene>
          ${sceneCode}
        </a-scene>
      </body>
    </html>
  `;
}
exports.default = generateHtml;
;
