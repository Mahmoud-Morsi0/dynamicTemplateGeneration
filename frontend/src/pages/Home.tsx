import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Globe, Zap } from 'lucide-react'

const Home: React.FC = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language as 'en' | 'ar'
  const isRTL = currentLanguage === 'ar'

  const features = [
    {
      icon: Upload,
      title: t('nav.upload'),
      description: 'Upload DOCX templates and automatically extract form fields',
    },
    {
      icon: FileText,
      title: t('nav.render'),
      description: 'Fill forms and generate completed documents instantly',
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Support for English and Arabic with RTL layout',
    },
    {
      icon: Zap,
      title: 'Dynamic Forms',
      description: 'Auto-generate forms with validation using React Hook Form + Zod',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/upload">
            <Button size="lg" className="w-full sm:w-auto">
              <Upload className="mr-2 h-5 w-5" />
              {t('home.uploadButton')}
            </Button>
          </Link>
          <Link to="/render">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <FileText className="mr-2 h-5 w-5" />
              {t('home.renderButton')}
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Language Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button
            variant="ghost"
            onClick={() => i18n.changeLanguage(isRTL ? 'en' : 'ar')}
            className="text-sm"
          >
            {isRTL ? 'English' : 'العربية'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
