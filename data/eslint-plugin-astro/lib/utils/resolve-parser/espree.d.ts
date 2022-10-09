import type { ParserOptions, TSESTree } from "@typescript-eslint/types";
declare type Espree = {
    parse(code: string, options?: ParserOptions | null): TSESTree.Program;
};
export declare function getEspree(): Espree;
export {};
