/// <reference types="node" />
import type { AddressInfo } from 'net';
import { ZodError } from 'zod';
import type { AstroConfig } from '../@types/astro';
import { ErrorWithMetadata } from './errors.js';
/** Display  */
export declare function req({ url, statusCode, reqTime, }: {
    url: string;
    statusCode: number;
    reqTime?: number;
}): string;
export declare function reload({ file }: {
    file: string;
}): string;
export declare function hmr({ file, style }: {
    file: string;
    style?: boolean;
}): string;
/** Display dev server host and startup time */
export declare function devStart({ startupTime, devServerAddressInfo, config, https, site, }: {
    startupTime: number;
    devServerAddressInfo: AddressInfo;
    config: AstroConfig;
    https: boolean;
    site: URL | undefined;
}): string;
export declare function telemetryNotice(): string;
export declare function telemetryEnabled(): string;
export declare function telemetryDisabled(): string;
export declare function telemetryReset(): string;
export declare function fsStrictWarning(): string;
export declare function prerelease({ currentVersion }: {
    currentVersion: string;
}): string;
export declare function success(message: string, tip?: string): string;
export declare function failure(message: string, tip?: string): string;
export declare function cancelled(message: string, tip?: string): string;
/** Display port in use */
export declare function portInUse({ port }: {
    port: number;
}): string;
export declare function getNetworkLogging(host: string | boolean): 'none' | 'host-to-expose' | 'visible';
export declare function formatConfigErrorMessage(err: ZodError): string;
export declare function formatErrorMessage(err: ErrorWithMetadata, args?: string[]): string;
export declare function printHelp({ commandName, headline, usage, tables, description, }: {
    commandName: string;
    headline?: string;
    usage?: string;
    tables?: Record<string, [command: string, help: string][]>;
    description?: string;
}): void;
