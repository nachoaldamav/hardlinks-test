import { CompletionContext, FoldingRange, Position, TextEdit, FormattingOptions } from 'vscode-languageserver';
import { ConfigManager } from '../../core/config';
import { AstroDocument } from '../../core/documents';
import { AppCompletionList, Plugin } from '../interfaces';
import { LanguageServiceManager } from '../typescript/LanguageServiceManager';
export declare class AstroPlugin implements Plugin {
    __name: string;
    private configManager;
    private readonly languageServiceManager;
    private readonly completionProvider;
    constructor(configManager: ConfigManager, languageServiceManager: LanguageServiceManager);
    getCompletions(document: AstroDocument, position: Position, completionContext?: CompletionContext): Promise<AppCompletionList | null>;
    formatDocument(document: AstroDocument, options: FormattingOptions): Promise<TextEdit[]>;
    getFoldingRanges(document: AstroDocument): FoldingRange[];
}
