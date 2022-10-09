import type { Context } from ".";
import type { TSESTree } from "@typescript-eslint/types";
import type { ESLintExtendedProgram } from "../types";
declare class RestoreNodeProcessContext {
    readonly result: ESLintExtendedProgram;
    readonly removeTokens: Set<(token: TSESTree.Token) => boolean>;
    private readonly parentMap;
    constructor(result: ESLintExtendedProgram, parentMap: Map<TSESTree.Node, TSESTree.Node | null>);
    addRemoveToken(test: (token: TSESTree.Token) => boolean): void;
    getParent(node: TSESTree.Node): TSESTree.Node | null;
}
export declare class ScriptContext {
    private readonly ctx;
    script: string;
    private consumedIndex;
    private readonly offsets;
    private readonly fragments;
    private readonly tokens;
    private readonly restoreNodeProcesses;
    constructor(ctx: Context);
    get originalCode(): string;
    skipOriginalOffset(offset: number): void;
    appendOriginal(index: number): void;
    appendScript(fragment: string): void;
    addToken(type: TSESTree.Token["type"], range: TSESTree.Range): void;
    addRestoreNodeProcess(process: (node: TSESTree.Node, context: RestoreNodeProcessContext) => boolean): void;
    /**
     * Restore AST nodes
     */
    restore(result: ESLintExtendedProgram): void;
    private remapLocation;
    private getRemapRange;
}
export {};
