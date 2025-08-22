"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().transform(Number).default('4000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    STORAGE_DIR: zod_1.z.string().default('./storage'),
    MAX_UPLOAD_MB: zod_1.z.string().transform(Number).default('10'),
    DB_URL: zod_1.z.string().default('file:./storage/app.db'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map