import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    en: {
        translation: {
            // Common
            'common.loading': 'Loading...',
            'common.error': 'Error',
            'common.success': 'Success',
            'common.cancel': 'Cancel',
            'common.save': 'Save',
            'common.submit': 'Submit',
            'common.back': 'Back',
            'common.next': 'Next',
            'common.continue': 'Continue',
            'common.download': 'Download',
            'common.upload': 'Upload',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.view': 'View',
            'common.add': 'Add',
            'common.remove': 'Remove',
            'common.required': 'Required',
            'common.optional': 'Optional',

            // Navigation
            'nav.home': 'Home',
            'nav.upload': 'Upload Template',
            'nav.render': 'Render Document',
            'nav.docs': 'Documentation',

            // Theme
            'theme.light': 'Light Mode',
            'theme.dark': 'Dark Mode',

            // Home page
            'home.title': 'Smart Document Template Generator',
            'home.subtitle': 'Upload DOCX templates and generate dynamic forms',
            'home.uploadButton': 'Upload Template',
            'home.renderButton': 'Render Document',

            // Upload page
            'upload.title': 'Upload Template',
            'upload.subtitle': 'Upload a DOCX file to extract form fields',
            'upload.dragDrop': 'Drag and drop a DOCX file here, or click to select',
            'upload.selectFile': 'Select File',
            'upload.fileType': 'Only DOCX files are supported',
            'upload.maxSize': 'Maximum file size: {{size}}MB',
            'upload.inspecting': 'Inspecting template...',
            'upload.success': 'Template inspected successfully!',
            'upload.error': 'Failed to inspect template',

            // Render page
            'render.title': 'Render Document',
            'render.subtitle': 'Fill in the form and generate your document',
            'render.rendering': 'Generating document...',
            'render.success': 'Document generated successfully!',
            'render.error': 'Failed to generate document',
            'render.download': 'Download Document',

            // Form fields
            'field.text': 'Text',
            'field.number': 'Number',
            'field.date': 'Date',
            'field.select': 'Select',
            'field.image': 'Image URL',
            'field.array': 'List',

            // Validation
            'validation.required': 'This field is required',
            'validation.invalidEmail': 'Invalid email address',
            'validation.invalidUrl': 'Invalid URL',
            'validation.minLength': 'Minimum {{min}} characters required',
            'validation.maxLength': 'Maximum {{max}} characters allowed',
            'validation.min': 'Minimum value is {{min}}',
            'validation.max': 'Maximum value is {{max}}',
            'validation.invalidDate': 'Invalid date format (YYYY-MM-DD)',
        },
    },
    ar: {
        translation: {
            // Common
            'common.loading': 'جاري التحميل...',
            'common.error': 'خطأ',
            'common.success': 'نجح',
            'common.cancel': 'إلغاء',
            'common.save': 'حفظ',
            'common.submit': 'إرسال',
            'common.back': 'رجوع',
            'common.next': 'التالي',
            'common.continue': 'متابعة',
            'common.download': 'تحميل',
            'common.upload': 'رفع',
            'common.delete': 'حذف',
            'common.edit': 'تعديل',
            'common.view': 'عرض',
            'common.add': 'إضافة',
            'common.remove': 'إزالة',
            'common.required': 'مطلوب',
            'common.optional': 'اختياري',

            // Navigation
            'nav.home': 'الرئيسية',
            'nav.upload': 'رفع قالب',
            'nav.render': 'إنشاء مستند',
            'nav.docs': 'التوثيق',

            // Theme
            'theme.light': 'الوضع الفاتح',
            'theme.dark': 'الوضع الداكن',

            // Home page
            'home.title': 'مولد قوالب المستندات الذكي',
            'home.subtitle': 'ارفع قوالب DOCX وأنشئ نماذج ديناميكية',
            'home.uploadButton': 'رفع قالب',
            'home.renderButton': 'إنشاء مستند',

            // Upload page
            'upload.title': 'رفع قالب',
            'upload.subtitle': 'ارفع ملف DOCX لاستخراج حقول النموذج',
            'upload.dragDrop': 'اسحب وأفلت ملف DOCX هنا، أو انقر للاختيار',
            'upload.selectFile': 'اختر ملف',
            'upload.fileType': 'يتم دعم ملفات DOCX فقط',
            'upload.maxSize': 'الحد الأقصى لحجم الملف: {{size}} ميجابايت',
            'upload.inspecting': 'جاري فحص القالب...',
            'upload.success': 'تم فحص القالب بنجاح!',
            'upload.error': 'فشل في فحص القالب',

            // Render page
            'render.title': 'إنشاء مستند',
            'render.subtitle': 'املأ النموذج وأنشئ مستندك',
            'render.rendering': 'جاري إنشاء المستند...',
            'render.success': 'تم إنشاء المستند بنجاح!',
            'render.error': 'فشل في إنشاء المستند',
            'render.download': 'تحميل المستند',

            // Form fields
            'field.text': 'نص',
            'field.number': 'رقم',
            'field.date': 'تاريخ',
            'field.select': 'اختيار',
            'field.image': 'رابط الصورة',
            'field.array': 'قائمة',

            // Validation
            'validation.required': 'هذا الحقل مطلوب',
            'validation.invalidEmail': 'عنوان بريد إلكتروني غير صحيح',
            'validation.invalidUrl': 'رابط غير صحيح',
            'validation.minLength': 'الحد الأدنى {{min}} حرف مطلوب',
            'validation.maxLength': 'الحد الأقصى {{max}} حرف مسموح',
            'validation.min': 'الحد الأدنى للقيمة هو {{min}}',
            'validation.max': 'الحد الأقصى للقيمة هو {{max}}',
            'validation.invalidDate': 'تنسيق تاريخ غير صحيح (YYYY-MM-DD)',
        },
    },
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: import.meta.env.DEV,

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
