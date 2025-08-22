import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileText, Sparkles } from 'lucide-react'

const Home: React.FC = () => {

  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      // For now, redirect to upload page
      // Later this could be enhanced to use the prompt for AI generation
      navigate('/upload')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Free Dynamic Document Generator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create official, editable documents from templates in seconds. Upload DOCX templates and generate dynamic forms to fill and create complete documents. 
            No sign-up needed. It's fast, fully customizable, and free.
          </p>
        </motion.div>

        {/* Main Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="border-border bg-card">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Text Input Area */}
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the type of document you want to create (e.g., contract, letter, form)"
                    className="w-full h-32 p-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      title="Template suggestions"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-3">
                    <Link to="/upload" className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Document
                      <span className="ml-1 text-xs">×</span>
                    </Button>
                  </div>
                  <Button 
                    onClick={handleGenerateClick}
                    className="ml-auto bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Creating
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Generate Documents from Templates with Dynamic Form Editor
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            DocGen's Template-Based Document Generator helps you instantly create accurate, branded documents from DOCX templates. 
            Upload your templates, extract form fields automatically, fill dynamic forms, and generate complete documents. 
            Whether you're managing contracts, letters, or reports, the system ensures consistency, clarity, and compliance. 
            Export or share in minutes.
          </p>

          {/* Quick Action Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Upload className="mr-2 h-5 w-5" />
                Upload Template
              </Button>
            </Link>
            <Link to="/render">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <FileText className="mr-2 h-5 w-5" />
                Create Document
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
