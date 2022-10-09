"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = exports.traverseNodes = exports.VisitorKeys = exports.parseForESLint = exports.ParseError = exports.AST = void 0;
const parser_1 = require("./parser");
const astro_tools_1 = require("./astro-tools");
Object.defineProperty(exports, "parseTemplate", { enumerable: true, get: function () { return astro_tools_1.parseTemplate; } });
const AST = __importStar(require("./ast"));
exports.AST = AST;
const traverse_1 = require("./traverse");
Object.defineProperty(exports, "traverseNodes", { enumerable: true, get: function () { return traverse_1.traverseNodes; } });
const visitor_keys_1 = require("./visitor-keys");
const errors_1 = require("./errors");
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return errors_1.ParseError; } });
/**
 * Parse source code
 */
function parseForESLint(code, options) {
    return (0, parser_1.parseForESLint)(code, options);
}
exports.parseForESLint = parseForESLint;
// Keys
// eslint-disable-next-line @typescript-eslint/naming-convention -- ignore
exports.VisitorKeys = visitor_keys_1.KEYS;
