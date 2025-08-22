import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../ui/navbar'

export const AppLayout: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check if user has a preference stored
    const stored = localStorage.getItem('theme')
    if (stored) {
      return stored === 'dark'
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Store preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
