import { z } from 'zod';
export interface FieldSpec {
    key: string;
    type: 'text' | 'number' | 'date' | 'select' | 'image' | 'array';
    label?: {
        en: string;
        ar: string;
    };
    required?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
    default?: string | number;
    constraints?: {
        width?: number;
        height?: number;
    };
    itemShape?: Record<string, FieldSpec>;
    format?: 'email';
}
export declare const generateZodSchema: (fields: FieldSpec[]) => z.ZodObject<any>;
//# sourceMappingURL=zod.d.ts.map