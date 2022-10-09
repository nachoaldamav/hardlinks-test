import { parseForESLint as parseAstro } from "./parser";
import { parseTemplate, ParseTemplateResult } from "./astro-tools";
import * as AST from "./ast";
import { traverseNodes } from "./traverse";
import { ParseError } from "./errors";
export { AST, ParseError };
/**
 * Parse source code
 */
export declare function parseForESLint(code: string, options?: any): ReturnType<typeof parseAstro>;
export declare const VisitorKeys: import("eslint").SourceCode.VisitorKeys;
export { traverseNodes, parseTemplate, ParseTemplateResult };
