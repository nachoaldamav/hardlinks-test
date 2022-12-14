"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientScript = void 0;
const types_1 = require("@typescript-eslint/types");
const parse_expression_1 = require("./parse-expression");
const RE_LEADING_SPACES = /^[\t ]+/u;
let seq = 0;
class Locs {
    constructor(lines) {
        const lineStartIndices = [0];
        let index = 0;
        for (const line of lines) {
            index += line.length;
            lineStartIndices.push(index);
        }
        this.lineStartIndices = lineStartIndices;
    }
    getLocFromIndex(index) {
        const lineNumber = sortedLastIndex(this.lineStartIndices, index);
        return {
            line: lineNumber,
            column: index - this.lineStartIndices[lineNumber - 1],
        };
    }
}
class ClientScript {
    constructor(code, script, parsed) {
        this.code = code;
        this.script = script;
        this.parsed = parsed;
        this.id = ++seq;
        this.block = this.initBlock();
    }
    initBlock() {
        const textNode = this.script.children[0];
        const startOffset = textNode.position.start.offset;
        const endOffset = this.parsed.getEndOffset(textNode);
        const startLoc = this.parsed.getLocFromIndex(startOffset);
        const lines = this.code.slice(startOffset, endOffset).split(/(?<=\n)/u);
        const firstLine = lines.shift();
        const textLines = [];
        const remapColumnOffsets = [];
        const remapLines = [];
        const defineVars = this.extractDefineVars();
        if (defineVars.length) {
            textLines.push("/* global\n");
            remapLines.push(-1);
            remapColumnOffsets.push(-1);
            for (const defineVar of defineVars) {
                textLines.push(`${defineVar.name}\n`);
                remapLines.push(defineVar.loc.line);
                remapColumnOffsets.push(defineVar.loc.column);
            }
            textLines.push("-- define:vars */\n");
            remapLines.push(-1);
            remapColumnOffsets.push(-1);
        }
        if (firstLine.trim()) {
            const firstLineIndent = (RE_LEADING_SPACES.exec(firstLine) || [""])[0]
                .length;
            textLines.push(firstLine.slice(firstLineIndent));
            remapLines.push(startLoc.line);
            remapColumnOffsets.push(firstLineIndent + startLoc.column);
        }
        const indent = getIndent(lines);
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            const lineIndent = Math.min(indent, line.length - 1);
            textLines.push(line.slice(lineIndent));
            remapLines.push(startLoc.line + index + 1);
            remapColumnOffsets.push(lineIndent);
        }
        const text = textLines.join("");
        const textLocs = new Locs(textLines);
        const remapRange = (range) => {
            return [
                this.parsed.getIndexFromLoc(remapLoc(textLocs.getLocFromIndex(range[0]))),
                this.parsed.getIndexFromLoc(remapLoc(textLocs.getLocFromIndex(range[1]))),
            ];
        };
        function remapLoc(loc) {
            var _a, _b;
            return {
                line: (_a = remapLines[loc.line - 1]) !== null && _a !== void 0 ? _a : -1,
                column: loc.column + ((_b = remapColumnOffsets[loc.line - 1]) !== null && _b !== void 0 ? _b : 0),
            };
        }
        return {
            text,
            remapMessage(message) {
                const loc = remapLoc(message);
                message.line = loc.line;
                message.column = loc.column;
                if (typeof message.endLine === "number" &&
                    typeof message.endColumn === "number") {
                    const loc = remapLoc({
                        line: message.endLine,
                        column: message.endColumn,
                    });
                    message.endLine = loc.line;
                    message.endColumn = loc.column;
                }
                if (message.fix) {
                    message.fix.range = remapRange(message.fix.range);
                }
                if (message.suggestions) {
                    for (const suggestion of message.suggestions) {
                        suggestion.fix.range = remapRange(suggestion.fix.range);
                    }
                }
                return message;
            },
        };
    }
    extractDefineVars() {
        const defineVars = this.script.attributes.find((attr) => attr.kind === "expression" && attr.name === "define:vars");
        if (!defineVars) {
            return [];
        }
        const valueStart = this.parsed.calcAttributeValueStartOffset(defineVars);
        const valueEnd = this.parsed.calcAttributeEndOffset(defineVars);
        let expression;
        try {
            expression = (0, parse_expression_1.parseExpression)(this.code.slice(valueStart + 1, valueEnd - 1));
        }
        catch (_a) {
            return [];
        }
        if (expression.type !== types_1.AST_NODE_TYPES.ObjectExpression)
            return [];
        const startLoc = this.parsed.getLocFromIndex(valueStart + 1);
        return expression.properties
            .filter((p) => p.type === types_1.AST_NODE_TYPES.Property)
            .filter((p) => !p.computed)
            .map((p) => {
            return {
                name: p.key.type === types_1.AST_NODE_TYPES.Identifier ? p.key.name : p.key.value,
                loc: {
                    line: p.key.loc.start.line + startLoc.line - 1,
                    column: p.key.loc.start.column +
                        (p.key.loc.start.line === 1 ? startLoc.column : 0),
                },
            };
        });
    }
    getProcessorFile() {
        return {
            text: this.block.text,
            filename: `${this.id}.js`,
        };
    }
    remapMessages(messages) {
        return messages
            .map((m) => this.block.remapMessage(m))
            .filter((m) => m.line >= 0);
    }
}
exports.ClientScript = ClientScript;
function getIndent(lines) {
    let indent = null;
    for (const line of lines) {
        if (!line.trim())
            continue;
        const lineIndent = (RE_LEADING_SPACES.exec(line) || [""])[0].length;
        if (indent == null) {
            indent = lineIndent;
        }
        else {
            indent = Math.min(indent, lineIndent);
        }
        if (indent === 0) {
            break;
        }
    }
    return indent || 0;
}
function sortedLastIndex(array, value) {
    let lower = 0;
    let upper = array.length;
    while (lower < upper) {
        const mid = Math.floor(lower + (upper - lower) / 2);
        const target = array[mid];
        if (target < value) {
            lower = mid + 1;
        }
        else if (target > value) {
            upper = mid;
        }
        else {
            return mid + 1;
        }
    }
    return upper;
}
