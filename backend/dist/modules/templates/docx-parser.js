"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocxParser = void 0;
const pizzip_1 = __importDefault(require("pizzip"));
const docxtemplater_1 = __importDefault(require("docxtemplater"));
class DocxParser {
    zip;
    doc;
    constructor(buffer) {
        this.zip = new pizzip_1.default(buffer);
        this.doc = new docxtemplater_1.default(this.zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
    }
    parsePlaceholder(text) {
        const placeholderRegex = /\{\{\s*([^|}]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g;
        const match = placeholderRegex.exec(text);
        if (!match)
            return null;
        const key = match[1]?.trim() || '';
        const modifiers = match[2] || '';
        const result = { key, type: 'text' };
        const modifierRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
        let modifierMatch;
        while ((modifierMatch = modifierRegex.exec(modifiers)) !== null) {
            const [, modifierKey, quotedValue, singleQuotedValue, unquotedValue] = modifierMatch;
            const value = quotedValue || singleQuotedValue || unquotedValue;
            switch (modifierKey) {
                case 'type':
                    if (value)
                        result.type = value;
                    break;
                case 'label':
                    if (value)
                        result.label = value;
                    break;
                case 'required':
                    result.required = value === 'true' || value === '';
                    break;
                case 'maxLength':
                    if (value)
                        result.maxLength = parseInt(value, 10);
                    break;
                case 'min':
                    if (value)
                        result.min = parseFloat(value);
                    break;
                case 'max':
                    if (value)
                        result.max = parseFloat(value);
                    break;
                case 'step':
                    if (value)
                        result.step = parseFloat(value);
                    break;
                case 'options':
                    if (value)
                        result.options = value.split(',').map(opt => opt.trim());
                    break;
                case 'default':
                    if (value)
                        result.default = value;
                    break;
                case 'width':
                    if (value)
                        result.width = parseInt(value, 10);
                    break;
                case 'height':
                    if (value)
                        result.height = parseInt(value, 10);
                    break;
            }
        }
        if (result.type === 'text') {
            result.type = this.inferFieldType(key, result);
        }
        return result;
    }
    inferFieldType(key, placeholder) {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('email') || keyLower.includes('mail')) {
            placeholder.format = 'email';
            return 'text';
        }
        if (keyLower.includes('date') || keyLower.includes('birth') || keyLower.includes('hire')) {
            return 'date';
        }
        if (keyLower.includes('salary') || keyLower.includes('amount') || keyLower.includes('price') ||
            keyLower.includes('number') || keyLower.includes('count')) {
            return 'number';
        }
        if (keyLower.includes('logo') || keyLower.includes('image') || keyLower.includes('photo')) {
            return 'image';
        }
        return 'text';
    }
    parseLoops(content) {
        const loops = [];
        const loopRegex = /\{#\s*(\w+)\s*\}(.*?)\{\/\s*\1\s*\}/gs;
        let match;
        while ((match = loopRegex.exec(content)) !== null) {
            const [, loopKey, loopContent] = match;
            const itemShape = {};
            const placeholderRegex = /\{\{\s*([^|}]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g;
            let placeholderMatch;
            while ((placeholderMatch = placeholderRegex.exec(loopContent)) !== null) {
                const parsed = this.parsePlaceholder(placeholderMatch[0]);
                if (parsed) {
                    itemShape[parsed.key] = this.convertToFieldSpec(parsed);
                }
            }
            if (Object.keys(itemShape).length > 0) {
                loops.push({ key: loopKey, itemShape });
            }
        }
        return loops;
    }
    convertToFieldSpec(parsed) {
        const fieldSpec = {
            key: parsed.key,
            type: parsed.type,
            ...(parsed.label && { label: { en: parsed.label, ar: parsed.label } }),
            ...(parsed.required !== undefined && { required: parsed.required }),
            ...(parsed.maxLength !== undefined && { maxLength: parsed.maxLength }),
            ...(parsed.min !== undefined && { min: parsed.min }),
            ...(parsed.max !== undefined && { max: parsed.max }),
            ...(parsed.step !== undefined && { step: parsed.step }),
            ...(parsed.options && { options: parsed.options }),
            ...(parsed.default && { default: parsed.default }),
            ...(parsed.format && { format: parsed.format }),
        };
        if (parsed.type === 'image' && (parsed.width || parsed.height)) {
            fieldSpec.constraints = {
                ...(parsed.width && { width: parsed.width }),
                ...(parsed.height && { height: parsed.height }),
            };
        }
        return fieldSpec;
    }
    parse() {
        const content = this.doc.getFullText();
        const fields = [];
        const loops = [];
        const placeholderRegex = /\{\{\s*([^|}]+)(?:\s*\|\s*([^}]+))?\s*\}\}/g;
        let match;
        while ((match = placeholderRegex.exec(content)) !== null) {
            const parsed = this.parsePlaceholder(match[0]);
            if (parsed) {
                fields.push(this.convertToFieldSpec(parsed));
            }
        }
        const parsedLoops = this.parseLoops(content);
        for (const loop of parsedLoops) {
            fields.push({
                key: loop.key,
                type: 'array',
                itemShape: loop.itemShape,
            });
        }
        return { fields, loops };
    }
}
exports.DocxParser = DocxParser;
//# sourceMappingURL=docx-parser.js.map