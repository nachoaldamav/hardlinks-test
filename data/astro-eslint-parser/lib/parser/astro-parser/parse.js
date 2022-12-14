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
exports.parse = void 0;
const service = __importStar(require("./astrojs-compiler-service"));
const astro_1 = require("../../astro");
const errors_1 = require("../../errors");
/**
 * Parse code by `@astrojs/compiler`
 */
function parse(code, ctx) {
    const ast = service.parse(code, { position: true }).ast;
    if (!ast.children) {
        // If the source code is empty, the children property may not be available.
        ast.children = [];
    }
    const htmlElement = ast.children.find((n) => n.type === "element" && n.name === "html");
    if (htmlElement) {
        adjustHTML(ast, htmlElement, ctx);
    }
    fixLocations(ast, ctx);
    return { ast };
}
exports.parse = parse;
/**
 * Adjust <html> element node
 */
function adjustHTML(ast, htmlElement, ctx) {
    const htmlEnd = ctx.code.indexOf("</html");
    if (htmlEnd == null) {
        return;
    }
    const hasTokenAfter = Boolean(ctx.code.slice(htmlEnd + 7).trim());
    const children = [...htmlElement.children];
    for (const child of children) {
        const offset = child.position?.start.offset;
        if (hasTokenAfter && offset != null) {
            if (htmlEnd <= offset) {
                htmlElement.children.splice(htmlElement.children.indexOf(child), 1);
                ast.children.push(child);
            }
        }
        if (child.type === "element" && child.name === "body") {
            adjustHTMLBody(ast, htmlElement, htmlEnd, hasTokenAfter, child, ctx);
        }
    }
}
/**
 * Adjust <body> element node
 */
function adjustHTMLBody(ast, htmlElement, htmlEnd, hasTokenAfterHtmlEnd, bodyElement, ctx) {
    const bodyEnd = ctx.code.indexOf("</body");
    if (bodyEnd == null) {
        return;
    }
    const hasTokenAfter = Boolean(ctx.code.slice(bodyEnd + 7, htmlEnd).trim());
    if (!hasTokenAfter && !hasTokenAfterHtmlEnd) {
        return;
    }
    const children = [...bodyElement.children];
    for (const child of children) {
        const offset = child.position?.start.offset;
        if (offset != null) {
            if (bodyEnd <= offset) {
                if (hasTokenAfterHtmlEnd && htmlEnd <= offset) {
                    bodyElement.children.splice(bodyElement.children.indexOf(child), 1);
                    ast.children.push(child);
                }
                else if (hasTokenAfter) {
                    bodyElement.children.splice(bodyElement.children.indexOf(child), 1);
                    htmlElement.children.push(child);
                }
            }
        }
    }
}
/**
 * Fix locations
 */
function fixLocations(node, ctx) {
    // FIXME: Adjust because the parser does not return the correct location.
    let start = 0;
    (0, astro_1.walk)(node, ctx.code, 
    // eslint-disable-next-line complexity -- X(
    (node, [parent]) => {
        if (node.type === "frontmatter") {
            start = node.position.start.offset = tokenIndex(ctx, "---", start);
            if (!node.position.end) {
                node.position.end = {};
            }
            start = node.position.end.offset =
                tokenIndex(ctx, "---", start + 3 + node.value.length) + 3;
        }
        else if (node.type === "fragment" ||
            node.type === "element" ||
            node.type === "component" ||
            node.type === "custom-element") {
            if (!node.position) {
                node.position = { start: {}, end: {} };
            }
            start = node.position.start.offset = tokenIndex(ctx, "<", start);
            start += 1;
            start += node.name.length;
            if (!node.attributes.length) {
                start = (0, astro_1.calcStartTagEndOffset)(node, ctx);
            }
        }
        else if (node.type === "attribute") {
            fixLocationForAttr(node, ctx, start);
            start = (0, astro_1.calcAttributeEndOffset)(node, ctx);
            if (node.position.end) {
                node.position.end.offset = start;
            }
        }
        else if (node.type === "comment") {
            node.position.start.offset = tokenIndex(ctx, "<!--", start);
            start = (0, astro_1.calcCommentEndOffset)(node, ctx);
            if (node.position.end) {
                node.position.end.offset = start;
            }
        }
        else if (node.type === "text") {
            if (parent.type === "element" &&
                (parent.name === "script" || parent.name === "style")) {
                node.position.start.offset = start;
                start = ctx.code.indexOf(`</${parent.name}`, start);
                if (start < 0) {
                    start = ctx.code.length;
                }
            }
            else {
                const index = tokenIndexSafe(ctx.code, node.value, start);
                if (index != null) {
                    start = node.position.start.offset = index;
                    start += node.value.length;
                }
                else {
                    // FIXME: Some white space may be removed.
                    node.position.start.offset = start;
                    const value = node.value.replace(/\s+/gu, "");
                    for (const char of value) {
                        const index = tokenIndex(ctx, char, start);
                        start = index + 1;
                    }
                    start = (0, astro_1.skipSpaces)(ctx.code, start);
                    node.value = ctx.code.slice(node.position.start.offset, start);
                }
            }
            if (node.position.end) {
                node.position.end.offset = start;
            }
        }
        else if (node.type === "expression") {
            start = node.position.start.offset = tokenIndex(ctx, "{", start);
            start += 1;
        }
        else if (node.type === "doctype") {
            if (!node.position) {
                node.position = { start: {}, end: {} };
            }
            if (!node.position.end) {
                node.position.end = {};
            }
            start = node.position.start.offset = tokenIndex(ctx, "<!", start);
            start += 2;
            start = node.position.end.offset =
                ctx.code.indexOf(">", start) + 1;
        }
        else if (node.type === "root") {
            // noop
        }
    }, (node, [parent]) => {
        if (node.type === "attribute") {
            const attributes = parent.attributes;
            if (attributes[attributes.length - 1] === node) {
                start = (0, astro_1.calcStartTagEndOffset)(parent, ctx);
            }
        }
        else if (node.type === "expression") {
            start = tokenIndex(ctx, "}", start) + 1;
        }
        else if (node.type === "fragment" ||
            node.type === "element" ||
            node.type === "component" ||
            node.type === "custom-element") {
            if (!(0, astro_1.getSelfClosingTag)(node, ctx)) {
                const closeTagStart = tokenIndexSafe(ctx.code, `</${node.name}`, start);
                if (closeTagStart != null) {
                    start = closeTagStart + 2 + node.name.length;
                    start = tokenIndex(ctx, ">", start) + 1;
                }
            }
        }
        else {
            return;
        }
        if (node.position.end) {
            node.position.end.offset = start;
        }
    });
}
/**
 * Fix locations
 */
function fixLocationForAttr(node, ctx, start) {
    if (node.kind === "empty") {
        node.position.start.offset = tokenIndex(ctx, node.name, start);
    }
    else if (node.kind === "quoted") {
        node.position.start.offset = tokenIndex(ctx, node.name, start);
    }
    else if (node.kind === "expression") {
        node.position.start.offset = tokenIndex(ctx, node.name, start);
    }
    else if (node.kind === "shorthand") {
        node.position.start.offset = tokenIndex(ctx, "{", start);
    }
    else if (node.kind === "spread") {
        node.position.start.offset = tokenIndex(ctx, "{", start);
    }
    else if (node.kind === "template-literal") {
        node.position.start.offset = tokenIndex(ctx, node.name, start);
    }
    else {
        throw new errors_1.ParseError(`Unknown attr kind: ${node.kind}`, node.position.start.offset, ctx);
    }
}
/**
 * Get token index
 */
function tokenIndex(ctx, token, position) {
    const index = tokenIndexSafe(ctx.code, token, position);
    if (index == null) {
        const start = token.trim() === token ? (0, astro_1.skipSpaces)(ctx.code, position) : position;
        throw new errors_1.ParseError(`Unknown token at ${start}, expected: ${JSON.stringify(token)}, actual: ${JSON.stringify(ctx.code.slice(start, start + 10))}`, start, ctx);
    }
    return index;
}
/**
 * Get token index
 */
function tokenIndexSafe(string, token, position) {
    const index = token.trim() === token ? (0, astro_1.skipSpaces)(string, position) : position;
    if (string.startsWith(token, index)) {
        return index;
    }
    return null;
}
