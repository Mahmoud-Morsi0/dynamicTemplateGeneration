"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateVersions = exports.templates = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.templates = (0, sqlite_core_1.sqliteTable)('templates', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    language: (0, sqlite_core_1.text)('language').notNull().default('en'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
exports.templateVersions = (0, sqlite_core_1.sqliteTable)('template_versions', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    templateId: (0, sqlite_core_1.text)('template_id').references(() => exports.templates.id),
    version: (0, sqlite_core_1.integer)('version').notNull().default(1),
    filePath: (0, sqlite_core_1.text)('file_path').notNull(),
    fileHash: (0, sqlite_core_1.text)('file_hash').notNull().unique(),
    fieldsSpec: (0, sqlite_core_1.text)('fields_spec').notNull(),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
//# sourceMappingURL=schema.js.map