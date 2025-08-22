export declare const generateFileHash: (buffer: Buffer) => string;
export declare const sanitizeFilename: (filename: string) => string;
export declare const saveTemplateFile: (buffer: Buffer, originalName: string) => Promise<{
    filePath: string;
    fileHash: string;
}>;
export declare const validateDocxFile: (buffer: Buffer, mimetype: string) => boolean;
//# sourceMappingURL=file.d.ts.map