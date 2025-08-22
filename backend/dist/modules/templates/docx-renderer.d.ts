export declare class DocxRenderer {
    private zip;
    private doc;
    constructor(buffer: Buffer);
    render(data: Record<string, any>): Buffer;
    static fromFile(filePath: string): Promise<DocxRenderer>;
}
//# sourceMappingURL=docx-renderer.d.ts.map