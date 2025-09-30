import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitCompare, ExternalLink, ArrowRight } from 'lucide-react'

// Import data
import pmbokData from '@/data/pmbok.json'
import prince2Data from '@/data/prince2.json'
import isoData from '@/data/iso.json'

const Comparison = ({ onNavigateToRepository }) => {
  const [selectedCategory, setSelectedCategory] = useState('risk')

  // Get unique categories from all standards
  const allSections = [
    ...pmbokData.sections,
    ...prince2Data.sections,
    ...isoData.sections
  ]
  
  const categories = [...new Set(allSections.map(section => section.category))]

  // Get sections for the selected category from each standard
  const getComparisonData = (category) => {
    const pmbok = pmbokData.sections.find(s => s.category === category)
    const prince2 = prince2Data.sections.find(s => s.category === category)
    const iso = isoData.sections.find(s => s.category === category)
    
    return { pmbok, prince2, iso }
  }

  const comparisonData = useMemo(() => getComparisonData(selectedCategory), [selectedCategory])

  const highlightKeywords = (text) => {
    if (!text) return ''
    const keywords = ['risk', 'stakeholder', 'quality', 'resource', 'communication', 'schedule', 'cost', 'management', 'project', 'process']
    let highlightedText = text
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword}s?)\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, '<strong class="text-blue-600">$1</strong>')
    })
    
    return { __html: highlightedText }
  }

  const scrollToSection = (sectionId, standard) => {
    // Navigate to Repository tab and highlight section
    window.location.hash = `repository-${sectionId}`
    
    if (onNavigateToRepository) {
      onNavigateToRepository('repository')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Standards Comparison</h2>
          <p className="text-gray-600 mt-1">
            Compare topics across PMBOK, PRINCE2, and ISO standards side-by-side
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-blue-600" />
          <Badge variant="secondary">3-way comparison</Badge>
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Select a Topic to Compare</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </Button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PMBOK Column */}
        <Card className="flex flex-col">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">PMBOK 7th Edition</CardTitle>
                <CardDescription className="text-blue-700">
                  {comparisonData.pmbok?.title || 'No matching section'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                PMBOK
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-6">
            {comparisonData.pmbok ? (
              <div className="space-y-4">
                <div 
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={highlightKeywords(comparisonData.pmbok.content)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(comparisonData.pmbok.id, 'PMBOK')}
                  className="text-blue-600"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View in Repository
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GitCompare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No {selectedCategory} section found in PMBOK</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PRINCE2 Column */}
        <Card className="flex flex-col">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-900">PRINCE2</CardTitle>
                <CardDescription className="text-green-700">
                  {comparisonData.prince2?.title || 'No matching section'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-green-300 text-green-700">
                PRINCE2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-6">
            {comparisonData.prince2 ? (
              <div className="space-y-4">
                <div 
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={highlightKeywords(comparisonData.prince2.content)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(comparisonData.prince2.id, 'PRINCE2')}
                  className="text-green-600"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View in Repository
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GitCompare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No {selectedCategory} section found in PRINCE2</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ISO Column */}
        <Card className="flex flex-col">
          <CardHeader className="bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-purple-900">ISO 21500/21502</CardTitle>
                <CardDescription className="text-purple-700">
                  {comparisonData.iso?.title || 'No matching section'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                ISO
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-6">
            {comparisonData.iso ? (
              <div className="space-y-4">
                <div 
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={highlightKeywords(comparisonData.iso.content)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(comparisonData.iso.id, 'ISO')}
                  className="text-purple-600"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View in Repository
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GitCompare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No {selectedCategory} section found in ISO</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Quick Analysis: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Common Themes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Process-based approach</li>
                <li>• Stakeholder involvement</li>
                <li>• Continuous monitoring</li>
                <li>• Documentation requirements</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-700">Key Differences</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PMBOK: Knowledge area focus</li>
                <li>• PRINCE2: Product-based approach</li>
                <li>• ISO: International standard perspective</li>
                <li>• Different terminology usage</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Regular review cycles</li>
                <li>• Clear role definitions</li>
                <li>• Tailored approaches</li>
                <li>• Lessons learned integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Comparison