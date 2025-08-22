import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useInspectTemplate } from '@/lib/queries'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const UploadInspect: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [inspectResult, setInspectResult] = useState<any>(null)
  
  const inspectMutation = useInspectTemplate()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setInspectResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleInspect = async () => {
    if (!uploadedFile) return

    try {
      const result = await inspectMutation.mutateAsync(uploadedFile)
      setInspectResult(result.data)
    } catch (error) {
      console.error('Inspection failed:', error)
    }
  }

  const handleContinue = () => {
    if (inspectResult) {
      // Store the result in localStorage or state management
      localStorage.setItem('templateSpec', JSON.stringify(inspectResult))
      navigate('/render')
    }
  }

  return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Upload Template
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a DOCX file to extract form fields and create dynamic documents
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('common.upload')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {uploadedFile ? (
                  <div>
                    <FileText className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('upload.dragDrop')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('upload.fileType')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {t('upload.maxSize', { size: 10 })}
                    </p>
                  </div>
                )}
              </div>

              {uploadedFile && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleInspect}
                    disabled={inspectMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {inspectMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t('upload.inspecting')}
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        {t('nav.upload')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inspection Results */}
          {inspectMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{t('upload.error')}</p>
                      <p className="text-sm">
                        {inspectMutation.error?.message || 'Unknown error occurred'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {inspectResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    {t('upload.success')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Template Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Template ID:</span>
                          <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                            {inspectResult.templateId}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Version:</span>
                          <p className="font-medium">{inspectResult.version}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Extracted Fields ({inspectResult.fields.length})
                      </h4>
                      <div className="grid gap-2">
                        {inspectResult.fields.map((field: any) => (
                          <div
                            key={field.key}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                          >
                            <div>
                              <span className="font-medium">{field.key}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                ({field.type})
                              </span>
                            </div>
                            {field.required && (
                              <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded">
                                {t('common.required')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleContinue} className="min-w-[120px]">
                        {t('common.continue')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
  )
}

export default UploadInspect
