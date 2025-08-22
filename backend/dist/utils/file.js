"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDocxFile = exports.saveTemplateFile = exports.sanitizeFilename = exports.generateFileHash = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const env_1 = require("../config/env");
const generateFileHash = (buffer) => {
    return (0, crypto_1.createHash)('sha256').update(buffer).digest('hex');
};
exports.generateFileHash = generateFileHash;
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};
exports.sanitizeFilename = sanitizeFilename;
const saveTemplateFile = async (buffer, originalName) => {
    const fileHash = (0, exports.generateFileHash)(buffer);
    const sanitizedName = (0, exports.sanitizeFilename)(originalName);
    const extension = path_1.default.extname(sanitizedName);
    const fileName = `${(0, uuid_1.v4)()}${extension}`;
    const filePath = path_1.default.join(env_1.env.STORAGE_DIR, 'templates', fileName);
    await fs_1.promises.mkdir(path_1.default.dirname(filePath), { recursive: true });
    await fs_1.promises.writeFile(filePath, buffer);
    return { filePath, fileHash };
};
exports.saveTemplateFile = saveTemplateFile;
const validateDocxFile = (buffer, mimetype) => {
    if (!mimetype.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return false;
    }
    const maxSize = env_1.env.MAX_UPLOAD_MB * 1024 * 1024;
    if (buffer.length > maxSize) {
        return false;
    }
    const docxMagicBytes = [0x50, 0x4B, 0x03, 0x04];
    const fileMagicBytes = Array.from(buffer.slice(0, 4));
    return docxMagicBytes.every((byte, index) => byte === fileMagicBytes[index]);
};
exports.validateDocxFile = validateDocxFile;
//# sourceMappingURL=file.js.map