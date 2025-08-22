"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectController = void 0;
const inspect_service_1 = require("./inspect.service");
const logger_1 = require("../../utils/logger");
class InspectController {
    inspectService;
    constructor() {
        this.inspectService = new inspect_service_1.InspectService();
    }
    async inspectTemplate(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            const { buffer, originalname, mimetype } = req.file;
            logger_1.logger.info('Inspecting template', {
                filename: originalname,
                size: buffer.length,
                mimetype
            });
            const result = await this.inspectService.inspectTemplate(buffer, originalname, mimetype);
            res.json({
                success: true,
                data: {
                    templateId: result.templateId,
                    version: result.version,
                    fields: result.fields,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error inspecting template:', error);
            res.status(500).json({
                error: 'Failed to inspect template',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async getTemplateSpec(req, res) {
        try {
            const { templateId } = req.params;
            const { version } = req.query;
            const result = await this.inspectService.getTemplateVersion(templateId, version ? parseInt(version, 10) : undefined);
            if (!result) {
                res.status(404).json({ error: 'Template not found' });
                return;
            }
            res.json({
                success: true,
                data: {
                    templateId: result.templateId,
                    version: result.version,
                    fields: result.fields,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting template spec:', error);
            res.status(500).json({
                error: 'Failed to get template specification',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
exports.InspectController = InspectController;
//# sourceMappingURL=inspect.controller.js.map