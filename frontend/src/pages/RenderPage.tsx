import React, { useState, useEffect } from 'react'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { useRenderDocument } from '@/lib/queries'
import { FileText, Download, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const RenderPage: React.FC = () => {

  const [templateSpec, setTemplateSpec] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  
  const renderMutation = useRenderDocument()

  useEffect(() => {
    // Get template spec from localStorage
    const stored = localStorage.getItem('templateSpec')
    if (stored) {
      try {
        setTemplateSpec(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse template spec:', error)
      }
    }
  }, [])

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data)
  }

  const handleRender = async () => {
    if (!templateSpec || !formData) return

    try {
      const blob = await renderMutation.mutateAsync({
        templateId: templateSpec.templateId,
        data: formData,
      })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'rendered-document.docx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Rendering failed:', error)
    }
  }

  if (!templateSpec) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Template Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Please upload a template first to render a document.
                </p>
                <Link to="/upload">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Upload
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              Render Document
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill in the form and generate your document
            </p>
          </div>

          {/* Template Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Template Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Template ID:</span>
                  <p className="font-mono text-xs bg-muted p-1 rounded mt-1 truncate">
                    {templateSpec.templateId}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <p className="font-medium text-foreground">{templateSpec.version}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fields:</span>
                  <p className="font-medium text-foreground">{templateSpec.fields.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Language:</span>
                  <p className="font-medium text-foreground">EN</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Fill Form</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicForm
                fields={templateSpec.fields}
                onSubmit={handleFormSubmit}
                isLoading={renderMutation.isPending}
              />
            </CardContent>
          </Card>

          {/* Render Button */}
          {Object.keys(formData).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleRender}
                disabled={renderMutation.isPending}
                size="lg"
                className="min-w-[200px]"
              >
                {renderMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Generating document...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Document
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Error Display */}
          {renderMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-destructive">
                    <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center">
                      !
                    </div>
                    <div>
                      <p className="font-medium">Failed to generate document</p>
                      <p className="text-sm">
                        {renderMutation.error?.message || 'Unknown error occurred'}
                      </p>
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

export default RenderPage
