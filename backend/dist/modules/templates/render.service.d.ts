export interface RenderRequest {
    templateId?: string;
    fileHash?: string;
    data: Record<string, any>;
}
export declare class RenderService {
    private inspectService;
    constructor();
    renderDocument(request: RenderRequest): Promise<Buffer>;
}
//# sourceMappingURL=render.service.d.ts.map