"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokens = exports.parseForESLint = void 0;
const visitor_keys_1 = require("../visitor-keys");
const types_1 = require("@typescript-eslint/types");
const script_1 = require("./script");
const sort_1 = require("./sort");
const process_template_1 = require("./process-template");
const template_1 = require("./template");
const parser_options_1 = require("../context/parser-options");
/**
 * Parse source code
 */
function parseForESLint(code, options) {
    const { result: resultTemplate, context: ctx } = (0, template_1.parseTemplate)(code);
    const scriptContext = (0, process_template_1.processTemplate)(ctx, resultTemplate);
    const parserOptions = new parser_options_1.ParserOptionsContext(options);
    const resultScript = (0, script_1.parseScript)(scriptContext.script, ctx, parserOptions);
    scriptContext.restore(resultScript);
    (0, sort_1.sort)(resultScript.ast.comments);
    (0, sort_1.sort)(resultScript.ast.tokens);
    extractTokens(resultScript, ctx);
    resultScript.services = Object.assign(resultScript.services || {}, {
        isAstro: true,
        getAstroAst() {
            return resultTemplate.ast;
        },
    });
    resultScript.visitorKeys = Object.assign({}, visitor_keys_1.KEYS, resultScript.visitorKeys);
    return resultScript;
}
exports.parseForESLint = parseForESLint;
/** Extract tokens */
function extractTokens(ast, ctx) {
    if (!ast.ast.tokens) {
        return;
    }
    const useRanges = (0, sort_1.sort)([
        ...ast.ast.tokens,
        ...(ast.ast.comments || []),
    ]).map((t) => t.range);
    let range = useRanges.shift();
    for (let index = 0; index < ctx.code.length; index++) {
        while (range && range[1] <= index) {
            range = useRanges.shift();
        }
        if (range && range[0] <= index) {
            index = range[1] - 1;
            continue;
        }
        const c = ctx.code[index];
        if (!c.trim()) {
            continue;
        }
        if (isPunctuator(c)) {
            ast.ast.tokens.push(ctx.buildToken(types_1.AST_TOKEN_TYPES.Punctuator, [index, index + 1]));
        }
        else {
            // unknown
            // It is may be a bug.
            ast.ast.tokens.push(ctx.buildToken(types_1.AST_TOKEN_TYPES.Identifier, [index, index + 1]));
        }
    }
    (0, sort_1.sort)(ast.ast.tokens);
    /**
     * Checks if the given char is punctuator
     */
    function isPunctuator(c) {
        return /^[^\w$]$/iu.test(c);
    }
}
exports.extractTokens = extractTokens;
