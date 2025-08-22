"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inspect_controller_1 = require("./inspect.controller");
const render_controller_1 = require("./render.controller");
const upload_1 = require("../../middleware/upload");
const router = (0, express_1.Router)();
const inspectController = new inspect_controller_1.InspectController();
const renderController = new render_controller_1.RenderController();
router.post('/inspect', upload_1.upload.single('file'), inspectController.inspectTemplate.bind(inspectController));
router.get('/:templateId/spec', inspectController.getTemplateSpec.bind(inspectController));
router.post('/render/docx', renderController.renderDocx.bind(renderController));
router.post('/:templateId/render/pdf', renderController.renderPdf.bind(renderController));
router.get('/', (req, res) => {
    res.status(501).json({
        error: 'Not Implemented',
        message: 'Template listing will be implemented in Phase 2',
    });
});
router.post('/', (req, res) => {
    res.status(501).json({
        error: 'Not Implemented',
        message: 'Template creation will be implemented in Phase 2',
    });
});
router.get('/:templateId', (req, res) => {
    res.status(501).json({
        error: 'Not Implemented',
        message: 'Template details will be implemented in Phase 2',
    });
});
exports.default = router;
//# sourceMappingURL=router.js.map