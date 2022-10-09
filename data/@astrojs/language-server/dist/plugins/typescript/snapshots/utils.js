"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classNameFromFilename = exports.createFromFrameworkFilePath = exports.createFromAstroFilePath = exports.createFromTSFilePath = exports.createFromNonAstroFilePath = exports.createFromFilePath = exports.createFromDocument = void 0;
const typescript_1 = __importDefault(require("typescript"));
const astro2tsx_1 = __importDefault(require("../astro2tsx"));
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("../utils");
const DocumentSnapshot_1 = require("./DocumentSnapshot");
const utils_2 = require("../../../utils");
const importPackage_1 = require("../../../importPackage");
// Utilities to create Snapshots from different contexts
function createFromDocument(document) {
    const { code } = (0, astro2tsx_1.default)(document.getText(), classNameFromFilename(document.getURL()));
    return new DocumentSnapshot_1.AstroSnapshot(document, code, typescript_1.default.ScriptKind.TSX);
}
exports.createFromDocument = createFromDocument;
/**
 * Returns an Astro or Framework or a ts/js snapshot from a file path, depending on the file contents.
 * @param filePath path to the file
 * @param createDocument function that is used to create a document in case it's an Astro file
 */
function createFromFilePath(filePath, createDocument) {
    if ((0, utils_1.isAstroFilePath)(filePath)) {
        return createFromAstroFilePath(filePath, createDocument);
    }
    else if ((0, utils_1.isFrameworkFilePath)(filePath)) {
        const framework = (0, utils_1.getFrameworkFromFilePath)(filePath);
        return createFromFrameworkFilePath(filePath, framework);
    }
    else {
        return createFromTSFilePath(filePath);
    }
}
exports.createFromFilePath = createFromFilePath;
/**
 * Return a Framework or a TS snapshot from a file path, depending on the file contents
 * Unlike createFromFilePath, this does not support creating an Astro snapshot
 */
function createFromNonAstroFilePath(filePath) {
    if ((0, utils_1.isFrameworkFilePath)(filePath)) {
        const framework = (0, utils_1.getFrameworkFromFilePath)(filePath);
        return createFromFrameworkFilePath(filePath, framework);
    }
    else {
        return createFromTSFilePath(filePath);
    }
}
exports.createFromNonAstroFilePath = createFromNonAstroFilePath;
/**
 * Returns a ts/js snapshot from a file path.
 * @param filePath path to the js/ts file
 * @param options options that apply in case it's a svelte file
 */
function createFromTSFilePath(filePath) {
    const originalText = typescript_1.default.sys.readFile(filePath) ?? '';
    return new DocumentSnapshot_1.TypeScriptDocumentSnapshot(0, filePath, originalText);
}
exports.createFromTSFilePath = createFromTSFilePath;
/**
 * Returns an Astro snapshot from a file path.
 * @param filePath path to the Astro file
 * @param createDocument function that is used to create a document
 */
function createFromAstroFilePath(filePath, createDocument) {
    const originalText = typescript_1.default.sys.readFile(filePath) ?? '';
    return createFromDocument(createDocument(filePath, originalText));
}
exports.createFromAstroFilePath = createFromAstroFilePath;
function createFromFrameworkFilePath(filePath, framework) {
    const className = classNameFromFilename(filePath);
    const originalText = typescript_1.default.sys.readFile(filePath) ?? '';
    let code = '';
    if (framework === 'svelte') {
        const svelteIntegration = (0, importPackage_1.importSvelteIntegration)(filePath);
        if (svelteIntegration) {
            code = svelteIntegration.toTSX(originalText, className);
        }
    }
    else if (framework === 'vue') {
        const vueIntegration = (0, importPackage_1.importVueIntegration)(filePath);
        if (vueIntegration) {
            code = vueIntegration.toTSX(originalText, className);
        }
    }
    return new DocumentSnapshot_1.TypeScriptDocumentSnapshot(0, filePath, code, typescript_1.default.ScriptKind.TSX);
}
exports.createFromFrameworkFilePath = createFromFrameworkFilePath;
function classNameFromFilename(filename) {
    const url = vscode_uri_1.URI.parse(filename);
    const withoutExtensions = vscode_uri_1.Utils.basename(url).slice(0, -vscode_uri_1.Utils.extname(url).length);
    const withoutInvalidCharacters = withoutExtensions
        .split('')
        // Although "-" is invalid, we leave it in, pascal-case-handling will throw it out later
        .filter((char) => /[A-Za-z$_\d-]/.test(char))
        .join('');
    const firstValidCharIdx = withoutInvalidCharacters
        .split('')
        // Although _ and $ are valid first characters for classes, they are invalid first characters
        // for tag names. For a better import autocompletion experience, we therefore throw them out.
        .findIndex((char) => /[A-Za-z]/.test(char));
    const withoutLeadingInvalidCharacters = withoutInvalidCharacters.substr(firstValidCharIdx);
    const inPascalCase = (0, utils_2.toPascalCase)(withoutLeadingInvalidCharacters);
    const finalName = firstValidCharIdx === -1 ? `A${inPascalCase}` : inPascalCase;
    return finalName;
}
exports.classNameFromFilename = classNameFromFilename;
