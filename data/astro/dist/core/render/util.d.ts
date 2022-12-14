import type { ModuleNode, ViteDevServer } from 'vite';
import type { Metadata } from '../../runtime/server/metadata.js';
/** Check if a URL is already valid */
export declare function isValidURL(url: string): boolean;
export declare const STYLE_EXTENSIONS: Set<string>;
export declare const isCSSRequest: (request: string) => boolean;
export declare function collectMdMetadata(metadata: Metadata, modGraph: ModuleNode, viteServer: ViteDevServer): Promise<void>;
