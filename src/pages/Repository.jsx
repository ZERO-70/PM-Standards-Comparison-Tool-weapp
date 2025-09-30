import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Search, Bookmark, ExternalLink, Link } from 'lucide-react'

// Import data
import pmbokData from '@/data/pmbok.json'
import prince2Data from '@/data/prince2.json'
import isoData from '@/data/iso.json'

const Repository = ({ highlightSection }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStandard, setSelectedStandard] = useState('all')
  const [expandedSections, setExpandedSections] = useState(new Set())
  const { toast } = useToast()

  // Auto-expand highlighted section
  useEffect(() => {
    if (highlightSection) {
      setExpandedSections(prev => new Set([...prev, highlightSection]))
      
      // Scroll to the highlighted section after a short delay
      setTimeout(() => {
        const element = document.getElementById(`section-${highlightSection}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [highlightSection])

  // Combine all standards data
  const allStandards = [pmbokData, prince2Data, isoData]
  const allSections = allStandards.flatMap(standard => 
    standard.sections.map(section => ({
      ...section,
      standard: standard.standard,
      standardShort: standard.standard.split(' ')[0]
    }))
  )

  // Filter sections based on search and selected standard
  const filteredSections = useMemo(() => {
    return allSections.filter(section => {
      const matchesSearch = searchTerm === '' || 
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStandard = selectedStandard === 'all' || 
        section.standardShort.toLowerCase() === selectedStandard.toLowerCase()
      
      return matchesSearch && matchesStandard
    })
  }, [searchTerm, selectedStandard, allSections])

  const toggleExpanded = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const addBookmark = (section) => {
    const bookmarks = JSON.parse(localStorage.getItem('pm-bookmarks') || '[]')
    const exists = bookmarks.find(b => b.id === section.id)
    if (!exists) {
      bookmarks.push(section)
      localStorage.setItem('pm-bookmarks', JSON.stringify(bookmarks))
      toast.success('Bookmarked!', `"${section.title}" has been saved to your bookmarks`)
    } else {
      toast.info('Already bookmarked', `"${section.title}" is already in your bookmarks`)
    }
  }

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark style="background-color: #fef08a; padding: 0 2px; border-radius: 2px;">$1</mark>')
  }

  const copyDeepLink = (sectionId) => {
    const url = `${window.location.origin}${window.location.pathname}#repository-${sectionId}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied!', 'Deep link has been copied to your clipboard', {
        action: (
          <Button variant="ghost" size="sm" className="text-xs">
            <Link className="h-3 w-3 mr-1" />
            Share
          </Button>
        )
      })
    }).catch(() => {
      toast.info('Deep link ready', url)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Standards Repository</h2>
          <p className="text-gray-600 mt-1">
            Browse and search through project management standards
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{filteredSections.length} sections found</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sections, content, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedStandard === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStandard('all')}
          >
            All Standards
          </Button>
          <Button
            variant={selectedStandard === 'pmbok' ? 'default' : 'outline'}
            onClick={() => setSelectedStandard('pmbok')}
          >
            PMBOK
          </Button>
          <Button
            variant={selectedStandard === 'prince2' ? 'default' : 'outline'}
            onClick={() => setSelectedStandard('prince2')}
          >
            PRINCE2
          </Button>
          <Button
            variant={selectedStandard === 'iso' ? 'default' : 'outline'}
            onClick={() => setSelectedStandard('iso')}
          >
            ISO
          </Button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSections.map((section) => (
          <Card 
            key={section.id} 
            id={`section-${section.id}`}
            className={`flex flex-col transition-all duration-300 ${
              highlightSection === section.id 
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{section.standardShort}</Badge>
                    <Badge variant="secondary">{section.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {highlightText(section.title, searchTerm)}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addBookmark(section)}
                  className="h-8 w-8"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {expandedSections.has(section.id) ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: highlightText(section.content, searchTerm)?.replace 
                        ? highlightText(section.content, searchTerm).replace(/\n/g, '<br/>')
                        : section.content.replace(/\n/g, '<br/>')
                    }} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ 
                      __html: (highlightText(section.content.substring(0, 150) + '...', searchTerm)?.replace 
                        ? highlightText(section.content.substring(0, 150) + '...', searchTerm).replace(/\n/g, '<br/>')
                        : section.content.substring(0, 150) + '...').replace(/\n/g, '<br/>')
                    }} />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(section.id)}
                  >
                    {expandedSections.has(section.id) ? 'Show Less' : 'Read More'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600"
                    onClick={() => copyDeepLink(section.id)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Deep Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sections found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  )
}

export default Repository