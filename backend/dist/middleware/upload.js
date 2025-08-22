"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const env_1 = require("../config/env");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(new Error('Only DOCX files are allowed'));
        return;
    }
    const maxSize = env_1.env.MAX_UPLOAD_MB * 1024 * 1024;
    if (file.size > maxSize) {
        cb(new Error(`File size must be less than ${env_1.env.MAX_UPLOAD_MB}MB`));
        return;
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: env_1.env.MAX_UPLOAD_MB * 1024 * 1024,
    },
});
//# sourceMappingURL=upload.js.map