import type { ParserObject } from "./parser-object";
declare type UserOptionParser = string | ParserObject | Record<string, string | ParserObject | undefined> | undefined;
/** Get parser for script lang */
export declare function getParserForLang(attrs: Record<string, string | undefined>, parser: UserOptionParser): string | ParserObject;
/** Get parser */
export declare function getParser(attrs: Record<string, string | undefined>, parser: any): ParserObject;
export {};
