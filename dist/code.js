"use strict";
(() => {
  // plugin-src/code.ts
  figma.showUI(__html__, { themeColors: true, height: 300 });
  figma.ui.onmessage = (msg) => {
    console.log("Backend msg recieved: " + msg.type);
    if (msg.type === "resize") {
      console.log("resize recieved");
      const clampedWidth = Math.min(msg.width, 1440) + 100;
      const clampedHeight = Math.min(msg.height, 1080) + 300;
      figma.ui.resize(clampedWidth, clampedHeight);
    }
    if (msg.type === "get-selection") {
      (async function() {
        const selection = figma.currentPage.selection;
        selection.forEach((node) => {
          node.clone();
        });
        const scene = figma.flatten(selection, figma.currentPage);
        const bytes = await scene.exportAsync({
          format: "PNG"
        });
        figma.ui.postMessage({
          type: "current-selection",
          width: scene.width,
          height: scene.height,
          payload: bytes
        });
      })();
    }
    if (msg.type === "image-data") {
      figma.ui.postMessage({ type: "handshake", message: "code.ts: Image received" });
    }
    if (msg.type === "cancel") {
      figma.closePlugin();
    }
  };
})();
