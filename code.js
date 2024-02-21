// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
    // This plugin will open a window to prompt the user to enter a number, and
    // it will then create that many rectangles on the screen.
    // This shows the HTML page in "ui.html".
    figma.showUI(__html__, { themeColors: true, height: 300 });
    // Calls to "parent.postMessage" from within the HTML page will trigger this
    // callback. The callback will be passed the "pluginMessage" property of the
    // posted message.
    figma.ui.onmessage = function (msg) {
        // One way of distinguishing between different types of messages sent from
        // your HTML page is to use an object with a "type" property like this.
        if (msg.type === 'resize') {
            var clampedWidth = Math.min(msg.width, 1440) + 100; //added for the buttons etc
            var clampedHeight = Math.min(msg.height, 1080) + 300;
            figma.ui.resize(clampedWidth, clampedHeight);
        }
        if (msg.type === 'get-selection') {
            (function () {
                return __awaiter(this, void 0, void 0, function () {
                    var selection, scene, bytes;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                selection = figma.currentPage.selection;
                                selection.forEach(function (node) {
                                    node.clone();
                                }); //clones each node to have a copy after we flatten
                                scene = figma.flatten(selection, figma.currentPage);
                                return [4 /*yield*/, scene.exportAsync({
                                        format: 'PNG'
                                    })];
                            case 1:
                                bytes = _a.sent();
                                figma.ui.postMessage({
                                    type: 'current-selection',
                                    width: scene.width,
                                    height: scene.height,
                                    payload: bytes
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            })();
        }
        if (msg.type === 'image-data') {
            figma.ui.postMessage({ type: 'handshake', message: "code.ts: Image received" });
        }
        // Make sure to close the plugin when you're done. Otherwise the plugin will
        // keep running, which shows the cancel button at the bottom of the screen.
        // figma.closePlugin();
        if (msg.type === 'cancel') {
            figma.closePlugin();
        }
    };
}
// Runs this code if the plugin is run in FigJam
if (figma.editorType === 'figjam') {
    // This plugin will open a window to prompt the user to enter a number, and
    // it will then create that many shapes and connectors on the screen.
    // This shows the HTML page in "ui.html".
    figma.showUI(__html__);
    // Calls to "parent.postMessage" from within the HTML page will trigger this
    // callback. The callback will be passed the "pluginMessage" property of the
    // posted message.
    figma.ui.onmessage = function (msg) {
        // One way of distinguishing between different types of messages sent from
        // your HTML page is to use an object with a "type" property like this.
        if (msg.type === 'create-shapes') {
            var numberOfShapes = msg.count;
            var nodes = [];
            for (var i = 0; i < numberOfShapes; i++) {
                var shape = figma.createShapeWithText();
                // You can set shapeType to one of: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT'
                shape.shapeType = 'ROUNDED_RECTANGLE';
                shape.x = i * (shape.width + 200);
                shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
                figma.currentPage.appendChild(shape);
                nodes.push(shape);
            }
            ;
            for (var i = 0; i < (numberOfShapes - 1); i++) {
                var connector = figma.createConnector();
                connector.strokeWeight = 8;
                connector.connectorStart = {
                    endpointNodeId: nodes[i].id,
                    magnet: 'AUTO',
                };
                connector.connectorEnd = {
                    endpointNodeId: nodes[i + 1].id,
                    magnet: 'AUTO',
                };
            }
            ;
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
        }
        // Make sure to close the plugin when you're done. Otherwise the plugin will
        // keep running, which shows the cancel button at the bottom of the screen.
        figma.closePlugin();
    };
}
;
