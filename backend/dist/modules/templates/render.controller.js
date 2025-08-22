"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderController = void 0;
const render_service_1 = require("./render.service");
const logger_1 = require("../../utils/logger");
class RenderController {
    renderService;
    constructor() {
        this.renderService = new render_service_1.RenderService();
    }
    async renderDocx(req, res) {
        try {
            const { templateId, fileHash, data } = req.body;
            if (!data) {
                res.status(400).json({ error: 'Data is required' });
                return;
            }
            if (!templateId && !fileHash) {
                res.status(400).json({ error: 'Either templateId or fileHash is required' });
                return;
            }
            const renderRequest = {
                templateId,
                fileHash,
                data,
            };
            logger_1.logger.info('Rendering document', {
                templateId,
                fileHash,
                dataKeys: Object.keys(data)
            });
            const renderedBuffer = await this.renderService.renderDocument(renderRequest);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', 'attachment; filename="rendered-document.docx"');
            res.setHeader('Content-Length', renderedBuffer.length.toString());
            res.send(renderedBuffer);
        }
        catch (error) {
            logger_1.logger.error('Error rendering document:', error);
            res.status(500).json({
                error: 'Failed to render document',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async renderPdf(req, res) {
        res.status(501).json({
            error: 'Not Implemented',
            message: 'PDF rendering will be implemented in Phase 3 with LibreOffice worker',
        });
    }
}
exports.RenderController = RenderController;
//# sourceMappingURL=render.controller.js.map