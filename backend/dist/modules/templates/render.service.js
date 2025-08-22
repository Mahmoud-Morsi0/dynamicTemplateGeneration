"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderService = void 0;
const drizzle_1 = require("../../db/drizzle");
const schema_1 = require("../../db/schema");
const docx_renderer_1 = require("./docx-renderer");
const inspect_service_1 = require("./inspect.service");
const logger_1 = require("../../utils/logger");
const zod_1 = require("zod");
class RenderService {
    inspectService;
    constructor() {
        this.inspectService = new inspect_service_1.InspectService();
    }
    async renderDocument(request) {
        let templateSpec;
        if (request.templateId) {
            templateSpec = await this.inspectService.getTemplateVersion(request.templateId);
        }
        else if (request.fileHash) {
            templateSpec = await this.inspectService.getTemplateByHash(request.fileHash);
        }
        else {
            throw new Error('Either templateId or fileHash must be provided');
        }
        if (!templateSpec) {
            throw new Error('Template not found');
        }
        try {
            templateSpec.zodSchema.parse(request.data);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                throw new Error(`Validation failed: ${validationErrors}`);
            }
            throw error;
        }
        const templateVersion = await drizzle_1.db
            .select()
            .from(schema_1.templateVersions)
            .where(schema_1.templateVersions.templateId.eq(templateSpec.templateId))
            .where(schema_1.templateVersions.version.eq(templateSpec.version))
            .limit(1);
        if (templateVersion.length === 0) {
            throw new Error('Template file not found');
        }
        const renderer = await docx_renderer_1.DocxRenderer.fromFile(templateVersion[0].filePath);
        const renderedBuffer = renderer.render(request.data);
        logger_1.logger.info('Document rendered successfully', {
            templateId: templateSpec.templateId,
            version: templateSpec.version
        });
        return renderedBuffer;
    }
}
exports.RenderService = RenderService;
//# sourceMappingURL=render.service.js.map