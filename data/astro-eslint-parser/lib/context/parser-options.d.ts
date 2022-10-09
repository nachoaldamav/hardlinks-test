import type { ParserObject } from "./resolve-parser/parser-object";
export declare class ParserOptionsContext {
    readonly parserOptions: any;
    private readonly state;
    constructor(options: any);
    getParser(): ParserObject;
    isTypeScript(): boolean;
}
