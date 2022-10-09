import type { AST } from "astro-eslint-parser";
export declare type TransformResult = {
    inputRange: AST.Range;
    output: string;
    mappings: string;
};
