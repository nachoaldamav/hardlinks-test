import type * as hast from 'hast';
import type * as mdast from 'mdast';
import type { all as Handlers, one as Handler, Options as RemarkRehypeOptions } from 'remark-rehype';
import type { ILanguageRegistration, IThemeRegistration, Theme } from 'shiki';
import type * as unified from 'unified';
import type { VFile } from 'vfile';
export type { Node } from 'unist';
export declare type RemarkPlugin<PluginParameters extends any[] = any[]> = unified.Plugin<PluginParameters, mdast.Root>;
export declare type RemarkPlugins = (string | [string, any] | RemarkPlugin | [RemarkPlugin, any])[];
export declare type RehypePlugin<PluginParameters extends any[] = any[]> = unified.Plugin<PluginParameters, hast.Root>;
export declare type RehypePlugins = (string | [string, any] | RehypePlugin | [RehypePlugin, any])[];
export declare type RemarkRehype = Omit<RemarkRehypeOptions, 'handlers' | 'unknownHandler'> & {
    handlers: typeof Handlers;
} & {
    handler: typeof Handler;
};
export interface ShikiConfig {
    langs?: ILanguageRegistration[];
    theme?: Theme | IThemeRegistration;
    wrap?: boolean | null;
}
export interface AstroMarkdownOptions {
    mode?: 'md' | 'mdx';
    drafts?: boolean;
    syntaxHighlight?: 'shiki' | 'prism' | false;
    shikiConfig?: ShikiConfig;
    remarkPlugins?: RemarkPlugins;
    rehypePlugins?: RehypePlugins;
    remarkRehype?: RemarkRehype;
    extendDefaultPlugins?: boolean;
}
export interface MarkdownRenderingOptions extends AstroMarkdownOptions {
    /** @internal */
    fileURL?: URL;
    /** @internal */
    $?: {
        scopedClassName: string | null;
    };
    isAstroFlavoredMd?: boolean;
}
export interface MarkdownHeading {
    depth: number;
    slug: string;
    text: string;
}
export interface MarkdownMetadata {
    headings: MarkdownHeading[];
    source: string;
    html: string;
}
export interface MarkdownRenderingResult {
    metadata: MarkdownMetadata;
    vfile: VFile;
    code: string;
}
