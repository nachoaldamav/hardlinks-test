import { ZodError } from 'zod';
import { ErrorWithMetadata } from '../core/errors.js';
interface ErrorEventPayload {
    code: number | undefined;
    isFatal: boolean;
    plugin?: string | undefined;
    cliCommand: string;
    anonymousMessageHint?: string | undefined;
}
interface ConfigErrorEventPayload extends ErrorEventPayload {
    isConfig: true;
    configErrorPaths: string[];
}
export declare function eventConfigError({ err, cmd, isFatal, }: {
    err: ZodError;
    cmd: string;
    isFatal: boolean;
}): {
    eventName: string;
    payload: ConfigErrorEventPayload;
}[];
export declare function eventError({ cmd, err, isFatal, }: {
    err: ErrorWithMetadata;
    cmd: string;
    isFatal: boolean;
}): {
    eventName: string;
    payload: ErrorEventPayload;
}[];
export {};
