"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectService = void 0;
const uuid_1 = require("uuid");
const drizzle_1 = require("../../db/drizzle");
const schema_1 = require("../../db/schema");
const docx_parser_1 = require("./docx-parser");
const file_1 = require("../../utils/file");
const zod_1 = require("../../utils/zod");
const logger_1 = require("../../utils/logger");
class InspectService {
    async inspectTemplate(buffer, originalName, mimetype) {
        if (!(0, file_1.validateDocxFile)(buffer, mimetype)) {
            throw new Error('Invalid DOCX file');
        }
        const parser = new docx_parser_1.DocxParser(buffer);
        const { fields } = parser.parse();
        const zodSchema = (0, zod_1.generateZodSchema)(fields);
        const { filePath, fileHash } = await (0, file_1.saveTemplateFile)(buffer, originalName);
        const existingVersion = await drizzle_1.db
            .select()
            .from(schema_1.templateVersions)
            .where(schema_1.templateVersions.fileHash.eq(fileHash))
            .limit(1);
        if (existingVersion.length > 0) {
            logger_1.logger.info('Template with same hash already exists, returning existing version');
            return {
                templateId: existingVersion[0].templateId || '',
                version: existingVersion[0].version,
                fields: existingVersion[0].fieldsSpec,
                zodSchema,
            };
        }
        const templateId = (0, uuid_1.v4)();
        const versionId = (0, uuid_1.v4)();
        await drizzle_1.db.insert(schema_1.templates).values({
            id: templateId,
            name: originalName,
            language: 'en',
        });
        await drizzle_1.db.insert(schema_1.templateVersions).values({
            id: versionId,
            templateId,
            version: 1,
            filePath,
            fileHash,
            fieldsSpec: fields,
        });
        logger_1.logger.info('Template inspected and saved', { templateId, fileHash });
        return {
            templateId,
            version: 1,
            fields,
            zodSchema,
        };
    }
    async getTemplateVersion(templateId, version) {
        const query = drizzle_1.db
            .select()
            .from(schema_1.templateVersions)
            .where(schema_1.templateVersions.templateId.eq(templateId));
        if (version) {
            query.where(schema_1.templateVersions.version.eq(version));
        }
        else {
            query.orderBy(schema_1.templateVersions.version.desc()).limit(1);
        }
        const result = await query;
        if (result.length === 0) {
            return null;
        }
        const templateVersion = result[0];
        const zodSchema = (0, zod_1.generateZodSchema)(templateVersion.fieldsSpec);
        return {
            templateId: templateVersion.templateId || '',
            version: templateVersion.version,
            fields: templateVersion.fieldsSpec,
            zodSchema,
        };
    }
    async getTemplateByHash(fileHash) {
        const result = await drizzle_1.db
            .select()
            .from(schema_1.templateVersions)
            .where(schema_1.templateVersions.fileHash.eq(fileHash))
            .limit(1);
        if (result.length === 0) {
            return null;
        }
        const templateVersion = result[0];
        const zodSchema = (0, zod_1.generateZodSchema)(templateVersion.fieldsSpec);
        return {
            templateId: templateVersion.templateId || '',
            version: templateVersion.version,
            fields: templateVersion.fieldsSpec,
            zodSchema,
        };
    }
}
exports.InspectService = InspectService;
//# sourceMappingURL=inspect.service.js.map