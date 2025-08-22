"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const error_1 = require("./middleware/error");
const rateLimit_1 = require("./middleware/rateLimit");
const router_1 = __importDefault(require("./modules/templates/router"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', rateLimit_1.apiLimiter);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/templates', rateLimit_1.uploadLimiter, router_1.default);
app.use(error_1.notFoundHandler);
app.use(error_1.errorHandler);
const PORT = env_1.env.PORT;
app.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT}`);
    logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
    logger_1.logger.info(`CORS Origin: ${env_1.env.CORS_ORIGIN}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map