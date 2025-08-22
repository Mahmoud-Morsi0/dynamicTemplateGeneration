import { FieldSpec } from '../../utils/zod';
interface ParsedLoop {
    key: string;
    itemShape: Record<string, FieldSpec>;
}
export declare class DocxParser {
    private zip;
    private doc;
    constructor(buffer: Buffer);
    private parsePlaceholder;
    private inferFieldType;
    private parseLoops;
    private convertToFieldSpec;
    parse(): {
        fields: FieldSpec[];
        loops: ParsedLoop[];
    };
}
export {};
//# sourceMappingURL=docx-parser.d.ts.map