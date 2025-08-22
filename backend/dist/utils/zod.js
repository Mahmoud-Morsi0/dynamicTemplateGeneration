"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZodSchema = void 0;
const zod_1 = require("zod");
const generateZodSchema = (fields) => {
    const schemaShape = {};
    for (const field of fields) {
        let fieldSchema;
        switch (field.type) {
            case 'text':
                fieldSchema = zod_1.z.string();
                if (field.required) {
                    fieldSchema = fieldSchema.min(1, 'This field is required');
                }
                if (field.maxLength) {
                    fieldSchema = fieldSchema.max(field.maxLength);
                }
                break;
            case 'number':
                fieldSchema = zod_1.z.number();
                if (field.min !== undefined) {
                    fieldSchema = fieldSchema.min(field.min);
                }
                if (field.max !== undefined) {
                    fieldSchema = fieldSchema.max(field.max);
                }
                break;
            case 'date':
                fieldSchema = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');
                break;
            case 'select':
                if (!field.options || field.options.length === 0) {
                    fieldSchema = zod_1.z.string();
                }
                else {
                    fieldSchema = zod_1.z.enum(field.options);
                }
                break;
            case 'image':
                fieldSchema = zod_1.z.string().url('Must be a valid URL');
                break;
            case 'array':
                if (field.itemShape) {
                    const itemSchema = (0, exports.generateZodSchema)(Object.entries(field.itemShape).map(([key, spec]) => ({
                        ...spec,
                        key,
                    })));
                    fieldSchema = zod_1.z.array(itemSchema);
                }
                else {
                    fieldSchema = zod_1.z.array(zod_1.z.any());
                }
                break;
            default:
                fieldSchema = zod_1.z.string();
        }
        if (!field.required) {
            fieldSchema = fieldSchema.optional();
        }
        schemaShape[field.key] = fieldSchema;
    }
    return zod_1.z.object(schemaShape);
};
exports.generateZodSchema = generateZodSchema;
//# sourceMappingURL=zod.js.map