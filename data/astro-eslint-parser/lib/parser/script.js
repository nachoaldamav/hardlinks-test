"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseScript = void 0;
const debug_1 = require("../debug");
const ts_patch_1 = require("./ts-patch");
const parser_object_1 = require("../context/resolve-parser/parser-object");
/**
 * Parse for script
 */
function parseScript(code, _ctx, parserOptions) {
    const parser = parserOptions.getParser();
    let patchResult;
    try {
        const scriptParserOptions = {
            ...parserOptions.parserOptions,
        };
        scriptParserOptions.ecmaFeatures = {
            ...(scriptParserOptions.ecmaFeatures || {}),
            jsx: true,
        };
        if (parserOptions.isTypeScript() &&
            scriptParserOptions.filePath &&
            scriptParserOptions.project) {
            patchResult = (0, ts_patch_1.tsPatch)(scriptParserOptions);
        }
        const result = (0, parser_object_1.isEnhancedParserObject)(parser)
            ? parser.parseForESLint(code, scriptParserOptions)
            : parser.parse(code, scriptParserOptions);
        if ("ast" in result && result.ast != null) {
            return result;
        }
        return { ast: result };
    }
    catch (e) {
        (0, debug_1.debug)("[script] parsing error:", e.message, `@ ${JSON.stringify(code)}

${code}`);
        throw e;
    }
    finally {
        patchResult?.terminate();
    }
}
exports.parseScript = parseScript;
