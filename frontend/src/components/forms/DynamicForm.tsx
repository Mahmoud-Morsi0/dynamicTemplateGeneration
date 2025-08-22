import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateZodSchema } from '@/lib/zodHelpers'
import type { FieldSpec } from '@/lib/api'
import { Plus, Minus, Trash2 } from 'lucide-react'

interface DynamicFormProps {
  fields: FieldSpec[]
  onSubmit: (data: Record<string, any>) => void
  isLoading?: boolean
  defaultValues?: Record<string, any>
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  isLoading = false,
  defaultValues = {},
}) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language as 'en' | 'ar'
  const isRTL = currentLanguage === 'ar'

  const schema = generateZodSchema(fields)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { handleSubmit, register, control, formState: { errors } } = form

  const renderField = (field: FieldSpec, index?: number) => {
    const fieldName = index !== undefined ? `${field.key}.${index}` : field.key
    const label = field.label?.[currentLanguage] || field.key
    const error = form.getFieldState(field.key, form.formState)

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              {...register(field.key)}
              type="text"
              placeholder={label}
              maxLength={field.maxLength}
              className={error?.error ? 'border-red-500' : ''}
            />
            {error?.error && (
              <p className="text-sm text-red-500">{error.error.message}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              {...register(field.key, { valueAsNumber: true })}
              type="number"
              placeholder={label}
              min={field.min}
              max={field.max}
              step={field.step}
              className={error?.error ? 'border-red-500' : ''}
            />
            {error?.error && (
              <p className="text-sm text-red-500">{error.error.message}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              {...register(field.key)}
              type="date"
              className={error?.error ? 'border-red-500' : ''}
            />
            {error?.error && (
              <p className="text-sm text-red-500">{error.error.message}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              {...register(field.key)}
              defaultValue={field.default}
              className={error?.error ? 'border-red-500' : ''}
            >
              <option value="">{t('common.select')}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {error?.error && (
              <p className="text-sm text-red-500">{error.error.message}</p>
            )}
          </div>
        )

      case 'image':
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              {...register(field.key)}
              type="url"
              placeholder="https://example.com/image.png"
              className={error?.error ? 'border-red-500' : ''}
            />
            {error?.error && (
              <p className="text-sm text-red-500">{error.error.message}</p>
            )}
          </div>
        )

      case 'array':
        return (
          <ArrayField
            key={field.key}
            field={field}
            form={form}
            currentLanguage={currentLanguage}
          />
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map(renderField)}
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? t('common.loading') : t('common.submit')}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

interface ArrayFieldProps {
  field: FieldSpec
  form: any
  currentLanguage: 'en' | 'ar'
}

const ArrayField: React.FC<ArrayFieldProps> = ({
  field,
  form,
  currentLanguage,
}) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: field.key,
  })

  const addItem = () => {
    const newItem: Record<string, any> = {}
    if (field.itemShape) {
      Object.keys(field.itemShape).forEach((key) => {
        newItem[key] = ''
      })
    }
    append(newItem)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {field.label?.[currentLanguage] || field.key}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('common.add')}
        </Button>
      </div>

      {fields.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative p-4 border rounded-lg bg-muted/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">
              {t('field.array')} {index + 1}
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {field.itemShape &&
              Object.entries(field.itemShape).map(([key, spec]) => {
                const fieldName = `${field.key}.${index}.${key}`
                const label = spec.label?.[currentLanguage] || key
                const error = form.getFieldState(fieldName, form.formState)

                switch (spec.type) {
                  case 'text':
                    return (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium">
                          {label}
                          {spec.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <Input
                          {...form.register(fieldName)}
                          type="text"
                          placeholder={label}
                          className={error?.error ? 'border-red-500' : ''}
                        />
                        {error?.error && (
                          <p className="text-sm text-red-500">{error.error.message}</p>
                        )}
                      </div>
                    )

                  case 'select':
                    return (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium">
                          {label}
                          {spec.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <Select
                          {...form.register(fieldName)}
                          defaultValue={spec.default}
                          className={error?.error ? 'border-red-500' : ''}
                        >
                          <option value="">{t('common.select')}</option>
                          {spec.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                        {error?.error && (
                          <p className="text-sm text-red-500">{error.error.message}</p>
                        )}
                      </div>
                    )

                  default:
                    return null
                }
              })}
          </div>
        </motion.div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('field.array')} {t('common.optional')}</p>
        </div>
      )}
    </div>
  )
}
