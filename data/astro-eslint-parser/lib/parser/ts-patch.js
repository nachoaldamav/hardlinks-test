"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsPatch = void 0;
const module_1 = require("module");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Apply a patch to parse .astro files as TSX.
 */
function tsPatch(scriptParserOptions) {
    let targetExt = ".astro";
    if (scriptParserOptions.filePath) {
        const ext = path_1.default.extname(scriptParserOptions.filePath);
        if (ext) {
            targetExt = ext;
        }
    }
    try {
        // Apply a patch to parse .astro files as TSX.
        const cwd = process.cwd();
        const relativeTo = path_1.default.join(cwd, "__placeholder__.js");
        const ts = (0, module_1.createRequire)(relativeTo)("typescript");
        const { ensureScriptKind, getScriptKindFromFileName } = ts;
        if (typeof ensureScriptKind === "function" &&
            typeof getScriptKindFromFileName === "function") {
            ts.ensureScriptKind = function (fileName, ...args) {
                if (fileName.endsWith(targetExt)) {
                    return ts.ScriptKind.TSX;
                }
                return ensureScriptKind.call(this, fileName, ...args);
            };
            ts.getScriptKindFromFileName = function (fileName, ...args) {
                if (fileName.endsWith(targetExt)) {
                    return ts.ScriptKind.TSX;
                }
                return getScriptKindFromFileName.call(this, fileName, ...args);
            };
            return {
                terminate() {
                    ts.ensureScriptKind = ensureScriptKind;
                    ts.getScriptKindFromFileName = getScriptKindFromFileName;
                },
            };
        }
    }
    catch {
        // ignore
    }
    // If the patch cannot be applied, create a tsx file and parse it.
    const tsxFilePath = `${scriptParserOptions.filePath}.tsx`;
    scriptParserOptions.filePath = tsxFilePath;
    if (!fs_1.default.existsSync(tsxFilePath)) {
        fs_1.default.writeFileSync(tsxFilePath, "/* temp for astro-eslint-parser */");
        return {
            terminate() {
                fs_1.default.unlinkSync(tsxFilePath);
            },
        };
    }
    return null;
}
exports.tsPatch = tsPatch;
