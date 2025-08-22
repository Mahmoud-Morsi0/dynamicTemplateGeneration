import type { FieldSpec } from '../../utils/zod';
export interface InspectResult {
    templateId: string;
    version: number;
    fields: FieldSpec[];
    zodSchema: any;
}
export declare class InspectService {
    inspectTemplate(buffer: Buffer, originalName: string, mimetype: string): Promise<InspectResult>;
    getTemplateVersion(templateId: string, version?: number): Promise<InspectResult | null>;
    getTemplateByHash(fileHash: string): Promise<InspectResult | null>;
}
//# sourceMappingURL=inspect.service.d.ts.map