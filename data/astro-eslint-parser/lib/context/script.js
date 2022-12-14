"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptContext = void 0;
const traverse_1 = require("../traverse");
class RestoreNodeProcessContext {
    constructor(result, parentMap) {
        this.removeTokens = new Set();
        this.result = result;
        this.parentMap = parentMap;
    }
    addRemoveToken(test) {
        this.removeTokens.add(test);
    }
    getParent(node) {
        return this.parentMap.get(node) || null;
    }
}
class ScriptContext {
    constructor(ctx) {
        this.script = "";
        this.consumedIndex = 0;
        this.offsets = [];
        this.fragments = [];
        this.tokens = [];
        this.restoreNodeProcesses = [];
        this.ctx = ctx;
    }
    get originalCode() {
        return this.ctx.code;
    }
    skipOriginalOffset(offset) {
        this.consumedIndex += offset;
    }
    appendOriginal(index) {
        if (this.consumedIndex >= index) {
            return;
        }
        this.offsets.push({
            original: this.consumedIndex,
            script: this.script.length,
        });
        this.script += this.ctx.code.slice(this.consumedIndex, index);
        this.consumedIndex = index;
    }
    appendScript(fragment) {
        const start = this.script.length;
        this.script += fragment;
        this.fragments.push({ start, end: this.script.length });
    }
    addToken(type, range) {
        if (range[0] >= range[1]) {
            return;
        }
        this.tokens.push(this.ctx.buildToken(type, range));
    }
    addRestoreNodeProcess(process) {
        this.restoreNodeProcesses.push(process);
    }
    /**
     * Restore AST nodes
     */
    restore(result) {
        // remap locations
        const traversed = new Map();
        (0, traverse_1.traverseNodes)(result.ast, {
            visitorKeys: result.visitorKeys,
            enterNode: (node, p) => {
                if (!traversed.has(node)) {
                    traversed.set(node, p);
                    this.remapLocation(node);
                }
            },
            leaveNode: (_node) => {
                // noop
            },
        });
        const tokens = [...this.tokens];
        for (const token of result.ast.tokens || []) {
            if (this.fragments.some((f) => f.start <= token.range[0] && token.range[1] <= f.end)) {
                continue;
            }
            this.remapLocation(token);
            tokens.push(token);
        }
        result.ast.tokens = tokens;
        for (const token of result.ast.comments || []) {
            this.remapLocation(token);
        }
        const context = new RestoreNodeProcessContext(result, traversed);
        let restoreNodeProcesses = this.restoreNodeProcesses;
        for (const [node, parent] of traversed) {
            if (!parent)
                continue;
            restoreNodeProcesses = restoreNodeProcesses.filter((proc) => !proc(node, context));
        }
        if (context.removeTokens.size) {
            const tokens = result.ast.tokens || [];
            for (let index = tokens.length - 1; index >= 0; index--) {
                const token = tokens[index];
                for (const rt of context.removeTokens) {
                    if (rt(token)) {
                        tokens.splice(index, 1);
                        context.removeTokens.delete(rt);
                        if (!context.removeTokens.size) {
                            break;
                        }
                    }
                }
            }
        }
        // Adjust program node location
        const firstOffset = Math.min(...[
            result.ast.body[0],
            result.ast.tokens?.[0],
            result.ast.comments?.[0],
        ]
            .filter(Boolean)
            .map((t) => t.range[0]));
        if (firstOffset < result.ast.range[0]) {
            result.ast.range[0] = firstOffset;
            result.ast.loc.start = this.ctx.getLocFromIndex(firstOffset);
        }
    }
    remapLocation(node) {
        let [start, end] = node.range;
        const startFragment = this.fragments.find((f) => f.start <= start && start < f.end);
        if (startFragment) {
            start = startFragment.end;
        }
        const endFragment = this.fragments.find((f) => f.start < end && end <= f.end);
        if (endFragment) {
            end = endFragment.start;
        }
        if (end < start) {
            const w = start;
            start = end;
            end = w;
        }
        const locs = this.ctx.getLocations(...this.getRemapRange(start, end));
        node.loc = locs.loc;
        node.range = locs.range;
        if (node.start != null) {
            delete node.start;
        }
        if (node.end != null) {
            delete node.end;
        }
    }
    getRemapRange(start, end) {
        if (!this.offsets.length) {
            return [start, end];
        }
        let lastStart = this.offsets[0];
        let lastEnd = this.offsets[0];
        for (const offset of this.offsets) {
            if (offset.script <= start) {
                lastStart = offset;
            }
            if (offset.script < end) {
                lastEnd = offset;
            }
            else {
                if (offset.script === end) {
                    const remapStart = lastStart.original + (start - lastStart.script);
                    if (this.tokens.some((t) => t.range[0] <= remapStart &&
                        offset.original <= t.range[1])) {
                        lastEnd = offset;
                    }
                }
                break;
            }
        }
        const remapStart = lastStart.original + (start - lastStart.script);
        const remapEnd = lastEnd.original + (end - lastEnd.script);
        return [remapStart, remapEnd];
    }
}
exports.ScriptContext = ScriptContext;
