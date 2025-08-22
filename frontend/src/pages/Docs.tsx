import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Code, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

const Docs: React.FC = () => {
  const { t } = useTranslation()

  const placeholderExamples = [
    {
      title: 'Basic Text Field',
      code: '{{ employeeName | type=text | label="Employee Name" | required }}',
      description: 'Simple text input with label and required validation',
    },
    {
      title: 'Number Field',
      code: '{{ salary | type=number | min=0 | step=0.01 }}',
      description: 'Numeric input with minimum value and step increment',
    },
    {
      title: 'Date Field',
      code: '{{ hireDate | type=date }}',
      description: 'Date picker input',
    },
    {
      title: 'Select Field',
      code: '{{ gender | type=select | options="Male,Female,Other" | default="Male" }}',
      description: 'Dropdown with predefined options and default value',
    },
    {
      title: 'Image Field',
      code: '{{ logo | type=image | width=120 | height=40 }}',
      description: 'Image URL input with size constraints',
    },
    {
      title: 'Array/Loop Field',
      code: `{# dependents }
- {{ name | type=text }} ({{ relation | type=select | options="Spouse,Child,Other" }})
{/ dependents }`,
      description: 'Repeating section for multiple items',
    },
  ]

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/templates/inspect',
      description: 'Upload and inspect DOCX template',
      body: 'multipart/form-data with file field',
    },
    {
      method: 'POST',
      path: '/api/templates/render/docx',
      description: 'Render filled document',
      body: 'JSON with templateId/fileHash and data',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Learn how to use the Smart Document Template Generator
            </p>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Placeholder Syntax */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Placeholder Syntax
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Use these placeholder patterns in your DOCX templates to define form fields:
              </p>
              
              <div className="grid gap-6">
                {placeholderExamples.map((example, index) => (
                  <motion.div
                    key={example.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {example.title}
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto mb-2">
                      <code>{example.code}</code>
                    </pre>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {example.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                REST API endpoints for programmatic access:
              </p>
              
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <motion.div
                    key={endpoint.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'POST' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {endpoint.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Body: {endpoint.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Templates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Sample Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Download sample templates to get started:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Employment Offer Template
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Contains text, number, date, select, and image fields
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download (Coming Soon)
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Benefits Form Template
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Includes loops for dependents and mixed language support
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download (Coming Soon)
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Create a DOCX Template</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Create a Word document with placeholders using the syntax above
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Upload and Inspect</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Upload your template to extract form field specifications
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Fill and Generate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fill out the generated form and download your completed document
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Docs
