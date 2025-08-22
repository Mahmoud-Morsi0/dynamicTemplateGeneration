import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { FieldSpec } from '../../utils/zod'

interface ParsedPlaceholder {
    key: string
    type: string
    label?: string
    required?: boolean
    maxLength?: number
    min?: number
    max?: number
    step?: number
    options?: string[]
    default?: string
    width?: number
    height?: number
    format?: 'email'
}

interface ParsedLoop {
    key: string
    itemShape: Record<string, FieldSpec>
}

export class DocxParser {
    private zip: PizZip
    private doc: Docxtemplater

    constructor(buffer: Buffer) {
        try {
            this.zip = new PizZip(buffer)
            this.doc = new Docxtemplater(this.zip, {
                paragraphLoop: true,
                linebreaks: true,
            })
        } catch (error) {
            throw new Error(`Failed to parse DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private parsePlaceholder(text: string): ParsedPlaceholder | null {
        // Match both {{ variable | key=value }} and {variable} formats
        const doubleRegex = /\{\{\s*([^|}]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g
        const singleRegex = /\{([^{}|]+)\}/g

        let match = doubleRegex.exec(text)
        let modifiers = ''

        if (!match) {
            match = singleRegex.exec(text)
            if (!match) return null
        } else {
            modifiers = match[2] || ''
        }

        const key = match[1]?.trim() || ''

        const result: ParsedPlaceholder = { key, type: 'text' }

        // Parse modifiers
        const modifierRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g
        let modifierMatch

        while ((modifierMatch = modifierRegex.exec(modifiers)) !== null) {
            const [, modifierKey, quotedValue, singleQuotedValue, unquotedValue] = modifierMatch
            const value = quotedValue || singleQuotedValue || unquotedValue

            switch (modifierKey) {
                case 'type':
                    if (value) result.type = value
                    break
                case 'label':
                    if (value) result.label = value
                    break
                case 'required':
                    result.required = value === 'true' || value === ''
                    break
                case 'maxLength':
                    if (value) result.maxLength = parseInt(value, 10)
                    break
                case 'min':
                    if (value) result.min = parseFloat(value)
                    break
                case 'max':
                    if (value) result.max = parseFloat(value)
                    break
                case 'step':
                    if (value) result.step = parseFloat(value)
                    break
                case 'options':
                    if (value) result.options = value.split(',').map(opt => opt.trim())
                    break
                case 'default':
                    if (value) result.default = value
                    break
                case 'width':
                    if (value) result.width = parseInt(value, 10)
                    break
                case 'height':
                    if (value) result.height = parseInt(value, 10)
                    break
            }
        }

        // Infer type if not specified
        if (result.type === 'text') {
            result.type = this.inferFieldType(key, result)
        }

        return result
    }

    private inferFieldType(key: string, placeholder: ParsedPlaceholder): FieldSpec['type'] {
        const keyLower = key.toLowerCase()

        // Check for common patterns
        if (keyLower.includes('email') || keyLower.includes('mail')) {
            placeholder.format = 'email'
            return 'text'
        }
        if (keyLower.includes('date') || keyLower.includes('birth') || keyLower.includes('hire')) {
            return 'date'
        }
        if (keyLower.includes('salary') || keyLower.includes('amount') || keyLower.includes('price') ||
            keyLower.includes('number') || keyLower.includes('count')) {
            return 'number'
        }
        if (keyLower.includes('logo') || keyLower.includes('image') || keyLower.includes('photo')) {
            return 'image'
        }

        return 'text'
    }

    private parseLoops(content: string): ParsedLoop[] {
        const loops: ParsedLoop[] = []
        const loopRegex = /\{#\s*(\w+)\s*\}(.*?)\{\/\s*\1\s*\}/gs

        let match
        while ((match = loopRegex.exec(content)) !== null) {
            const [, loopKey, loopContent] = match
            if (!loopKey || !loopContent) continue

            const itemShape: Record<string, FieldSpec> = {}

            // Parse placeholders within the loop
            const placeholderRegex = /\{\{\s*([^|}]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g
            let placeholderMatch

            while ((placeholderMatch = placeholderRegex.exec(loopContent)) !== null) {
                const parsed = this.parsePlaceholder(placeholderMatch[0])
                if (parsed) {
                    itemShape[parsed.key] = this.convertToFieldSpec(parsed)
                }
            }

            if (Object.keys(itemShape).length > 0) {
                loops.push({ key: loopKey, itemShape })
            }
        }

        return loops
    }

    private convertToFieldSpec(parsed: ParsedPlaceholder): FieldSpec {
        const fieldSpec: FieldSpec = {
            key: parsed.key,
            type: parsed.type as FieldSpec['type'],
            ...(parsed.label && { label: { en: parsed.label, ar: parsed.label } }),
            ...(parsed.required !== undefined && { required: parsed.required }),
            ...(parsed.maxLength !== undefined && { maxLength: parsed.maxLength }),
            ...(parsed.min !== undefined && { min: parsed.min }),
            ...(parsed.max !== undefined && { max: parsed.max }),
            ...(parsed.step !== undefined && { step: parsed.step }),
            ...(parsed.options && { options: parsed.options }),
            ...(parsed.default && { default: parsed.default }),
            ...(parsed.format && { format: parsed.format }),
        }

        if (parsed.type === 'image' && (parsed.width || parsed.height)) {
            fieldSpec.constraints = {
                ...(parsed.width && { width: parsed.width }),
                ...(parsed.height && { height: parsed.height }),
            }
        }

        return fieldSpec
    }

    public parse(): { fields: FieldSpec[]; loops: ParsedLoop[] } {
        try {
            const content = this.doc.getFullText()
            const fields: FieldSpec[] = []
            const loops: ParsedLoop[] = []

            // Parse regular placeholders - both {{ variable }} and {variable} formats
            const doubleRegex = /\{\{\s*([^|}]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g
            const singleRegex = /\{([^{}|]+)\}/g

            let match
            // Parse double braces first
            while ((match = doubleRegex.exec(content)) !== null) {
                const parsed = this.parsePlaceholder(match[0])
                if (parsed) {
                    fields.push(this.convertToFieldSpec(parsed))
                }
            }

            // Parse single braces
            while ((match = singleRegex.exec(content)) !== null) {
                const parsed = this.parsePlaceholder(match[0])
                if (parsed) {
                    fields.push(this.convertToFieldSpec(parsed))
                }
            }

            // Parse loops
            const parsedLoops = this.parseLoops(content)
            for (const loop of parsedLoops) {
                fields.push({
                    key: loop.key,
                    type: 'array',
                    itemShape: loop.itemShape,
                })
            }

            return { fields, loops }
        } catch (error) {
            throw new Error(`Failed to parse document content: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}
