import type { Context } from "../context";
import type { AstroProgram } from "../ast";
import type { ScopeManager } from "eslint-scope";
import type { ParseResult } from "@astrojs/compiler";
import type { ESLintExtendedProgram } from "../types";
/**
 * Parse source code
 */
export declare function parseForESLint(code: string, options?: any): {
    ast: AstroProgram;
    services: Record<string, any> & {
        isAstro: true;
        getAstroAst: () => ParseResult;
    };
    visitorKeys: {
        [type: string]: string[];
    };
    scopeManager: ScopeManager;
};
/** Extract tokens */
export declare function extractTokens(ast: ESLintExtendedProgram, ctx: Context): void;
