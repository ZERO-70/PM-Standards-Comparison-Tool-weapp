import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToastProvider } from '@/components/ui/toast'
import Repository from '@/pages/Repository'
import Comparison from '@/pages/Comparison'
import Insights from '@/pages/Insights'
import Bookmarks from '@/pages/Bookmarks'
import { BookOpen, GitCompare, BarChart3, Bookmark } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('repository')
  const [highlightSection, setHighlightSection] = useState(null)

  // Handle URL hash changes for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      
      if (hash.startsWith('repository-')) {
        setActiveTab('repository')
        const sectionId = hash.replace('repository-', '')
        setHighlightSection(sectionId)
        
        // Clear highlight after a delay
        setTimeout(() => {
          setHighlightSection(null)
        }, 3000)
      } else if (hash) {
        // Handle other tab navigation
        if (['repository', 'comparison', 'insights', 'bookmarks'].includes(hash)) {
          setActiveTab(hash)
        }
      }
    }

    // Handle initial hash
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Update URL hash when tab changes
  const handleTabChange = (value) => {
    setActiveTab(value)
    window.location.hash = value
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    PM Standards Comparison Tool
                  </h1>
                  <p className="text-sm text-gray-600">
                    Compare PMBOK 7th Edition, PRINCE2, and ISO 21500/21502
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="repository" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Repository
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                Comparison
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repository">
              <Repository highlightSection={highlightSection} />
            </TabsContent>

            <TabsContent value="comparison">
              <Comparison onNavigateToRepository={setActiveTab} />
            </TabsContent>

            <TabsContent value="insights">
              <Insights />
            </TabsContent>

            <TabsContent value="bookmarks">
              <Bookmarks onNavigateToRepository={setActiveTab} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ToastProvider>
  )
}

export default App