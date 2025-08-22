import { z } from 'zod'
import type { FieldSpec } from './api'

export const generateZodSchema = (fields: FieldSpec[]): z.ZodObject<any> => {
    const schemaShape: Record<string, z.ZodTypeAny> = {}

    for (const field of fields) {
        let fieldSchema: z.ZodTypeAny

        switch (field.type) {
            case 'text':
                fieldSchema = z.string()
                if (field.required) {
                    fieldSchema = fieldSchema.min(1, 'This field is required')
                }
                if (field.maxLength) {
                    fieldSchema = fieldSchema.max(field.maxLength)
                }
                break

            case 'number':
                fieldSchema = z.number()
                if (field.min !== undefined) {
                    fieldSchema = fieldSchema.min(field.min)
                }
                if (field.max !== undefined) {
                    fieldSchema = fieldSchema.max(field.max)
                }
                break

            case 'date':
                fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
                break

            case 'select':
                if (!field.options || field.options.length === 0) {
                    fieldSchema = z.string()
                } else {
                    fieldSchema = z.enum(field.options as [string, ...string[]])
                }
                break

            case 'image':
                fieldSchema = z.string().url('Must be a valid URL')
                break

            case 'array':
                if (field.itemShape) {
                    const itemSchema = generateZodSchema(Object.entries(field.itemShape).map(([key, spec]) => ({
                        ...spec,
                        key,
                    })))
                    fieldSchema = z.array(itemSchema)
                } else {
                    fieldSchema = z.array(z.any())
                }
                break

            default:
                fieldSchema = z.string()
        }

        if (!field.required) {
            fieldSchema = fieldSchema.optional()
        }

        schemaShape[field.key] = fieldSchema
    }

    return z.object(schemaShape)
}
