"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocxRenderer = void 0;
const pizzip_1 = __importDefault(require("pizzip"));
const docxtemplater_1 = __importDefault(require("docxtemplater"));
const docxtemplater_image_module_free_1 = __importDefault(require("docxtemplater-image-module-free"));
const fs_1 = require("fs");
const logger_1 = require("../../utils/logger");
class DocxRenderer {
    zip;
    doc;
    constructor(buffer) {
        this.zip = new pizzip_1.default(buffer);
        const imageModule = new docxtemplater_image_module_free_1.default({
            centered: false,
            fileType: 'docx',
            getImage: async (tagValue) => {
                try {
                    const response = await fetch(tagValue);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`);
                    }
                    const arrayBuffer = await response.arrayBuffer();
                    return {
                        width: 120,
                        height: 40,
                        data: Buffer.from(arrayBuffer),
                        extension: '.png',
                    };
                }
                catch (error) {
                    logger_1.logger.error('Error fetching image:', error);
                    return null;
                }
            },
            getSize: (img, tagValue, tagName) => {
                const sizeMatch = tagName.match(/width=(\d+).*height=(\d+)/);
                if (sizeMatch) {
                    return [parseInt(sizeMatch[1]), parseInt(sizeMatch[2])];
                }
                return [120, 40];
            },
        });
        this.doc = new docxtemplater_1.default(this.zip, {
            paragraphLoop: true,
            linebreaks: true,
            modules: [imageModule],
        });
    }
    render(data) {
        try {
            this.doc.setData(data);
            this.doc.render();
            const output = this.doc.getZip().generate({ type: 'nodebuffer' });
            return output;
        }
        catch (error) {
            logger_1.logger.error('Error rendering document:', error);
            throw new Error(`Failed to render document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static async fromFile(filePath) {
        try {
            const buffer = await fs_1.promises.readFile(filePath);
            return new DocxRenderer(buffer);
        }
        catch (error) {
            logger_1.logger.error('Error reading template file:', error);
            throw new Error(`Failed to read template file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.DocxRenderer = DocxRenderer;
//# sourceMappingURL=docx-renderer.js.map