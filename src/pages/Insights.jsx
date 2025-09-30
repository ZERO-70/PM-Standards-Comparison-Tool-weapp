import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, Copy, Download } from 'lucide-react'

// Import data
import pmbokData from '@/data/pmbok.json'
import prince2Data from '@/data/prince2.json'
import isoData from '@/data/iso.json'

const Insights = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview')
  const { toast } = useToast()

  const generateInsights = () => {
    const allStandards = [pmbokData, prince2Data, isoData]
    const allSections = allStandards.flatMap(standard => 
      standard.sections.map(section => ({
        ...section,
        standard: standard.standard
      }))
    )

    // Group by categories
    const categories = {}
    allSections.forEach(section => {
      if (!categories[section.category]) {
        categories[section.category] = []
      }
      categories[section.category].push(section)
    })

    return {
      totalSections: allSections.length,
      totalCategories: Object.keys(categories).length,
      standards: allStandards.length,
      categories,
      coverageAnalysis: Object.entries(categories).map(([category, sections]) => ({
        category,
        coverage: sections.length,
        standards: [...new Set(sections.map(s => s.standard.split(' ')[0]))]
      }))
    }
  }

  const insights = useMemo(() => generateInsights(), [])

  const similarities = [
    {
      title: "Process-Based Approach",
      description: "All three standards emphasize systematic, process-driven project management methodologies.",
      standards: ["PMBOK", "PRINCE2", "ISO"],
      impact: "High"
    },
    {
      title: "Stakeholder Engagement",
      description: "Common focus on identifying, analyzing, and managing stakeholder relationships throughout the project lifecycle.",
      standards: ["PMBOK", "PRINCE2", "ISO"],
      impact: "High"
    },
    {
      title: "Risk Management Integration",
      description: "All standards treat risk management as an integral part of project management, not a separate activity.",
      standards: ["PMBOK", "PRINCE2", "ISO"],
      impact: "Medium"
    },
    {
      title: "Quality Focus",
      description: "Emphasis on quality planning, assurance, and control throughout the project lifecycle.",
      standards: ["PMBOK", "PRINCE2", "ISO"],
      impact: "Medium"
    }
  ]

  const differences = [
    {
      title: "Organizational Structure",
      description: "PMBOK focuses on knowledge areas, PRINCE2 on principles/themes/processes, ISO on integrated approach.",
      comparison: {
        "PMBOK": "10 Knowledge Areas",
        "PRINCE2": "7 Principles, 7 Themes, 7 Processes",
        "ISO": "Integrated Process Groups"
      },
      impact: "High"
    },
    {
      title: "Product vs. Activity Focus",
      description: "PRINCE2 emphasizes product delivery, while PMBOK and ISO focus more on activities and processes.",
      comparison: {
        "PMBOK": "Activity-based planning",
        "PRINCE2": "Product-based planning",
        "ISO": "Process-based approach"
      },
      impact: "Medium"
    },
    {
      title: "Governance Approach",
      description: "Different approaches to project governance and decision-making structures.",
      comparison: {
        "PMBOK": "Project Manager authority",
        "PRINCE2": "Project Board governance",
        "ISO": "Organizational integration"
      },
      impact: "High"
    }
  ]

  const uniquePoints = [
    {
      standard: "PMBOK",
      title: "Knowledge Area Integration",
      description: "Unique 10 knowledge area framework providing comprehensive coverage of PM domains.",
      value: "Comprehensive knowledge taxonomy"
    },
    {
      standard: "PRINCE2",
      title: "Management by Exception",
      description: "Distinctive approach to project control through defined tolerance levels and escalation procedures.",
      value: "Efficient governance model"
    },
    {
      standard: "PRINCE2",
      title: "Product-Based Planning",
      description: "Focus on deliverables and products rather than activities, providing clear outcome orientation.",
      value: "Outcome-focused delivery"
    },
    {
      standard: "ISO",
      title: "International Standardization",
      description: "Global perspective with emphasis on organizational context and international best practices.",
      value: "Universal applicability"
    },
    {
      standard: "ISO",
      title: "Organizational Context",
      description: "Strong emphasis on adapting project management to organizational and environmental factors.",
      value: "Contextual adaptation"
    }
  ]

  const exportSummary = () => {
    const summary = {
      analysis_date: new Date().toISOString(),
      overview: {
        total_sections: insights.totalSections,
        total_categories: insights.totalCategories,
        standards_compared: insights.standards
      },
      similarities,
      differences,
      unique_points: uniquePoints,
      coverage_analysis: insights.coverageAnalysis
    }
    
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pm-standards-analysis.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Export complete!', 'Analysis exported as pm-standards-analysis.json')
  }

  const copyToClipboard = () => {
    const summary = `
PM Standards Analysis Summary
Generated on: ${new Date().toLocaleDateString()}

SIMILARITIES:
${similarities.map(s => `• ${s.title}: ${s.description}`).join('\n')}

DIFFERENCES:
${differences.map(d => `• ${d.title}: ${d.description}`).join('\n')}

UNIQUE POINTS:
${uniquePoints.map(u => `• ${u.standard} - ${u.title}: ${u.description}`).join('\n')}
    `
    navigator.clipboard.writeText(summary).then(() => {
      toast.success('Copied to clipboard!', 'Analysis summary has been copied')
    }).catch(() => {
      toast.error('Copy failed', 'Unable to copy to clipboard')
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Insights Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Analyze similarities, differences, and unique aspects across PM standards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Summary
          </Button>
          <Button onClick={exportSummary}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold">{insights.totalSections}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{insights.totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Standards</p>
                <p className="text-2xl font-bold">{insights.standards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lightbulb className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Coverage</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedAnalysis === 'overview' ? 'default' : 'outline'}
          onClick={() => setSelectedAnalysis('overview')}
        >
          Overview
        </Button>
        <Button
          variant={selectedAnalysis === 'coverage' ? 'default' : 'outline'}
          onClick={() => setSelectedAnalysis('coverage')}
        >
          Coverage Analysis
        </Button>
      </div>

      {/* Main Content */}
      {selectedAnalysis === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Similarities */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Similarities
              </CardTitle>
              <CardDescription className="text-green-700">
                Common themes across all standards
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {similarities.map((similarity, index) => (
                  <div key={index} className="border-l-4 border-green-200 pl-4">
                    <h4 className="font-semibold text-sm">{similarity.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{similarity.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Badge 
                        variant={similarity.impact === 'High' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {similarity.impact} Impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Differences */}
          <Card>
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Differences
              </CardTitle>
              <CardDescription className="text-orange-700">
                Key variations between standards
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {differences.map((difference, index) => (
                  <div key={index} className="border-l-4 border-orange-200 pl-4">
                    <h4 className="font-semibold text-sm">{difference.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{difference.description}</p>
                    <div className="mt-2 space-y-1">
                      {Object.entries(difference.comparison).map(([standard, approach]) => (
                        <div key={standard} className="flex justify-between text-xs">
                          <span className="font-medium">{standard}:</span>
                          <span className="text-gray-600">{approach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unique Points */}
          <Card>
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Unique Points
              </CardTitle>
              <CardDescription className="text-purple-700">
                Distinctive features of each standard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {uniquePoints.map((point, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {point.standard}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm">{point.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{point.description}</p>
                    <p className="text-xs text-purple-600 mt-1 font-medium">
                      Value: {point.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedAnalysis === 'coverage' && (
        <Card>
          <CardHeader>
            <CardTitle>Coverage Analysis by Category</CardTitle>
            <CardDescription>
              How each category is covered across the three standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {insights.coverageAnalysis.map((item) => (
                <div key={item.category} className="border rounded-lg p-4">
                  <h4 className="font-semibold capitalize mb-2">{item.category}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coverage:</span>
                      <span className="font-medium">{item.coverage}/3</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.standards.map((standard) => (
                        <Badge key={standard} variant="secondary" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.coverage / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Insights