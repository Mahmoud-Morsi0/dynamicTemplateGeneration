"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const docx_parser_1 = require("./docx-parser");
(0, vitest_1.describe)('DocxParser', () => {
    (0, vitest_1.it)('should parse simple text placeholders', () => {
        const mockBuffer = Buffer.from('test');
        const parser = new docx_parser_1.DocxParser(mockBuffer);
        parser['doc'].getFullText = () => 'Hello {{ name | type=text | label="Full Name" | required }}';
        const result = parser.parse();
        (0, vitest_1.expect)(result.fields).toHaveLength(1);
        (0, vitest_1.expect)(result.fields[0]).toEqual({
            key: 'name',
            type: 'text',
            label: { en: 'Full Name', ar: 'Full Name' },
            required: true,
        });
    });
    (0, vitest_1.it)('should parse number placeholders', () => {
        const mockBuffer = Buffer.from('test');
        const parser = new docx_parser_1.DocxParser(mockBuffer);
        parser['doc'].getFullText = () => 'Salary: {{ salary | type=number | min=0 | step=0.01 }}';
        const result = parser.parse();
        (0, vitest_1.expect)(result.fields).toHaveLength(1);
        (0, vitest_1.expect)(result.fields[0]).toEqual({
            key: 'salary',
            type: 'number',
            min: 0,
            step: 0.01,
        });
    });
    (0, vitest_1.it)('should parse select placeholders', () => {
        const mockBuffer = Buffer.from('test');
        const parser = new docx_parser_1.DocxParser(mockBuffer);
        parser['doc'].getFullText = () => 'Gender: {{ gender | type=select | options="Male,Female,Other" | default="Male" }}';
        const result = parser.parse();
        (0, vitest_1.expect)(result.fields).toHaveLength(1);
        (0, vitest_1.expect)(result.fields[0]).toEqual({
            key: 'gender',
            type: 'select',
            options: ['Male', 'Female', 'Other'],
            default: 'Male',
        });
    });
    (0, vitest_1.it)('should parse image placeholders', () => {
        const mockBuffer = Buffer.from('test');
        const parser = new docx_parser_1.DocxParser(mockBuffer);
        parser['doc'].getFullText = () => '{{ logo | type=image | width=120 | height=40 }}';
        const result = parser.parse();
        (0, vitest_1.expect)(result.fields).toHaveLength(1);
        (0, vitest_1.expect)(result.fields[0]).toEqual({
            key: 'logo',
            type: 'image',
            constraints: {
                width: 120,
                height: 40,
            },
        });
    });
    (0, vitest_1.it)('should parse loop blocks', () => {
        const mockBuffer = Buffer.from('test');
        const parser = new docx_parser_1.DocxParser(mockBuffer);
        parser['doc'].getFullText = () => `
      {# dependents }
      - {{ name | type=text }} ({{ relation | type=select | options="Spouse,Child,Other" }})
      {/ dependents }
    `;
        const result = parser.parse();
        (0, vitest_1.expect)(result.fields).toHaveLength(1);
        (0, vitest_1.expect)(result.fields[0].type).toBe('array');
        (0, vitest_1.expect)(result.fields[0].itemShape).toBeDefined();
        (0, vitest_1.expect)(Object.keys(result.fields[0].itemShape || {})).toHaveLength(2);
    });
    (0, vitest_1.it)('should infer field types from key names', () => {
        const mockBuffer = Buffer.from('test');
        const parser = new docx_parser_1.DocxParser(mockBuffer);
        parser['doc'].getFullText = () => `
      {{ employeeName }}
      {{ hireDate }}
      {{ salary }}
      {{ companyLogo }}
    `;
        const result = parser.parse();
        (0, vitest_1.expect)(result.fields).toHaveLength(4);
        (0, vitest_1.expect)(result.fields.find(f => f.key === 'employeeName')?.type).toBe('text');
        (0, vitest_1.expect)(result.fields.find(f => f.key === 'hireDate')?.type).toBe('date');
        (0, vitest_1.expect)(result.fields.find(f => f.key === 'salary')?.type).toBe('number');
        (0, vitest_1.expect)(result.fields.find(f => f.key === 'companyLogo')?.type).toBe('image');
    });
});
//# sourceMappingURL=docx-parser.test.js.map