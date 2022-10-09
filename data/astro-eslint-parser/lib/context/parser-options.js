"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserOptionsContext = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolve_parser_1 = require("./resolve-parser");
const parser_object_1 = require("./resolve-parser/parser-object");
class ParserOptionsContext {
    constructor(options) {
        this.state = {};
        const parserOptions = {
            ecmaVersion: 2020,
            sourceType: "module",
            loc: true,
            range: true,
            raw: true,
            tokens: true,
            comment: true,
            eslintVisitorKeys: true,
            eslintScopeManager: true,
            ...(options || {}),
        };
        parserOptions.ecmaFeatures = {
            ...(parserOptions.ecmaFeatures || {}),
            jsx: true,
        };
        parserOptions.sourceType = "module";
        if (parserOptions.ecmaVersion <= 5 ||
            parserOptions.ecmaVersion == null) {
            parserOptions.ecmaVersion = 2015;
        }
        this.parserOptions = parserOptions;
    }
    getParser() {
        return (0, resolve_parser_1.getParser)({}, this.parserOptions.parser);
    }
    isTypeScript() {
        if (this.state.isTypeScript != null) {
            return this.state.isTypeScript;
        }
        const parserValue = (0, resolve_parser_1.getParserForLang)({}, this.parserOptions?.parser);
        if ((0, parser_object_1.maybeTSESLintParserObject)(parserValue) ||
            parserValue === "@typescript-eslint/parser") {
            return (this.state.isTypeScript = true);
        }
        if (typeof parserValue !== "string") {
            return (this.state.isTypeScript = false);
        }
        const parserName = parserValue;
        if (parserName.includes("@typescript-eslint/parser")) {
            let targetPath = parserName;
            while (targetPath) {
                const pkgPath = path_1.default.join(targetPath, "package.json");
                if (fs_1.default.existsSync(pkgPath)) {
                    try {
                        return (this.state.isTypeScript =
                            JSON.parse(fs_1.default.readFileSync(pkgPath, "utf-8"))
                                ?.name === "@typescript-eslint/parser");
                    }
                    catch {
                        return (this.state.isTypeScript = false);
                    }
                }
                const parent = path_1.default.dirname(targetPath);
                if (targetPath === parent) {
                    break;
                }
                targetPath = parent;
            }
        }
        return (this.state.isTypeScript = false);
    }
}
exports.ParserOptionsContext = ParserOptionsContext;
