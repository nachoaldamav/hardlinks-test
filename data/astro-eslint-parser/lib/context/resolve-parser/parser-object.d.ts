import type { TSESTree } from "@typescript-eslint/types";
import type { ESLintExtendedProgram } from "../../types";
import type * as tsESLintParser from "@typescript-eslint/parser";
declare type TSESLintParser = typeof tsESLintParser;
/**
 * The type of basic ESLint custom parser.
 * e.g. espree
 */
export declare type BasicParserObject = {
    parse(code: string, options: any): TSESTree.Program;
    parseForESLint: undefined;
};
/**
 * The type of ESLint custom parser enhanced for ESLint.
 * e.g. @babel/eslint-parser, @typescript-eslint/parser
 */
export declare type EnhancedParserObject = {
    parseForESLint(code: string, options: any): ESLintExtendedProgram;
    parse: undefined;
};
/**
 * The type of ESLint (custom) parsers.
 */
export declare type ParserObject = EnhancedParserObject | BasicParserObject;
/** Checks whether given object is ParserObject */
export declare function isParserObject(value: unknown): value is ParserObject;
/** Checks whether given object is EnhancedParserObject */
export declare function isEnhancedParserObject(value: unknown): value is EnhancedParserObject;
/** Checks whether given object is BasicParserObject */
export declare function isBasicParserObject(value: unknown): value is BasicParserObject;
/** Checks whether given object is "@typescript-eslint/parser" */
export declare function maybeTSESLintParserObject(value: unknown): value is TSESLintParser;
export {};
