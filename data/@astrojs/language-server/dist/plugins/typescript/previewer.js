"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarkdownDocumentation = exports.plain = exports.getTagDocumentation = void 0;
/**
 * adopted from https://github.com/microsoft/vscode/blob/10722887b8629f90cc38ee7d90d54e8246dc895f/extensions/typescript-language-features/src/utils/previewer.ts
 */
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("../../utils");
function replaceLinks(text) {
    return (text
        // Http(s) links
        .replace(/\{@(link|linkplain|linkcode) (https?:\/\/[^ |}]+?)(?:[| ]([^{}\n]+?))?\}/gi, (_, tag, link, label) => {
        switch (tag) {
            case 'linkcode':
                return `[\`${label ? label.trim() : link}\`](${link})`;
            default:
                return `[${label ? label.trim() : link}](${link})`;
        }
    }));
}
function processInlineTags(text) {
    return replaceLinks(text);
}
function getTagBodyText(tag) {
    if (!tag.text) {
        return undefined;
    }
    // Convert to markdown code block if it is not already one
    function makeCodeblock(text) {
        if (text.match(/^\s*[~`]{3}/g)) {
            return text;
        }
        return '```\n' + text + '\n```';
    }
    function makeExampleTag(text) {
        // check for caption tags, fix for https://github.com/microsoft/vscode/issues/79704
        const captionTagMatches = text.match(/<caption>(.*?)<\/caption>\s*(\r\n|\n)/);
        if (captionTagMatches && captionTagMatches.index === 0) {
            return captionTagMatches[1] + '\n\n' + makeCodeblock(text.substr(captionTagMatches[0].length));
        }
        else {
            return makeCodeblock(text);
        }
    }
    function makeEmailTag(text) {
        // fix obsucated email address, https://github.com/microsoft/vscode/issues/80898
        const emailMatch = text.match(/(.+)\s<([-.\w]+@[-.\w]+)>/);
        if (emailMatch === null) {
            return text;
        }
        else {
            return `${emailMatch[1]} ${emailMatch[2]}`;
        }
    }
    switch (tag.name) {
        case 'example':
            return makeExampleTag(typescript_1.default.displayPartsToString(tag.text));
        case 'author':
            return makeEmailTag(typescript_1.default.displayPartsToString(tag.text));
        case 'default':
            return makeCodeblock(typescript_1.default.displayPartsToString(tag.text));
    }
    return processInlineTags(typescript_1.default.displayPartsToString(tag.text));
}
function getTagDocumentation(tag) {
    function getWithType() {
        const body = (typescript_1.default.displayPartsToString(tag.text) || '').split(/^(\S+)\s*-?\s*/);
        if (body?.length === 3) {
            const param = body[1];
            const doc = body[2];
            const label = `*@${tag.name}* \`${param}\``;
            if (!doc) {
                return label;
            }
            return label + (doc.match(/\r\n|\n/g) ? '  \n' + processInlineTags(doc) : ` — ${processInlineTags(doc)}`);
        }
    }
    switch (tag.name) {
        case 'augments':
        case 'extends':
        case 'param':
        case 'template':
            return getWithType();
    }
    // Generic tag
    const label = `*@${tag.name}*`;
    const text = getTagBodyText(tag);
    if (!text) {
        return label;
    }
    return label + (text.match(/\r\n|\n/g) ? '  \n' + text : ` — ${text}`);
}
exports.getTagDocumentation = getTagDocumentation;
function plain(parts) {
    return processInlineTags(typeof parts === 'string' ? parts : typescript_1.default.displayPartsToString(parts));
}
exports.plain = plain;
function getMarkdownDocumentation(documentation, tags) {
    let result = [];
    if (documentation) {
        result.push(plain(documentation));
    }
    if (tags) {
        result = result.concat(tags.map(getTagDocumentation));
    }
    return result.filter(utils_1.isNotNullOrUndefined).join('\n\n');
}
exports.getMarkdownDocumentation = getMarkdownDocumentation;
