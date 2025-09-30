import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Bookmark, Trash2, ExternalLink, BookOpen, AlertTriangle } from 'lucide-react'

const Bookmarks = ({ onNavigateToRepository }) => {
  const [bookmarks, setBookmarks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showClearDialog, setShowClearDialog] = useState(false)
  const { toast } = useToast()

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('pm-bookmarks') || '[]')
    setBookmarks(savedBookmarks)
  }, [])

  // Get unique categories from bookmarks
  const categories = ['all', ...new Set(bookmarks.map(bookmark => bookmark.category))]

  // Filter bookmarks by category
  const filteredBookmarks = selectedCategory === 'all' 
    ? bookmarks 
    : bookmarks.filter(bookmark => bookmark.category === selectedCategory)

  const removeBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId)
    const removedBookmark = bookmarks.find(b => b.id === bookmarkId)
    setBookmarks(updatedBookmarks)
    localStorage.setItem('pm-bookmarks', JSON.stringify(updatedBookmarks))
    
    if (removedBookmark) {
      toast.success('Bookmark removed', `"${removedBookmark.title}" has been removed from bookmarks`)
    }
  }

  const clearAllBookmarks = () => {
    const count = bookmarks.length
    setBookmarks([])
    localStorage.removeItem('pm-bookmarks')
    setShowClearDialog(false)
    toast.success('All bookmarks cleared', `Removed ${count} bookmarks from your collection`)
  }

  const groupBookmarksByStandard = () => {
    const grouped = {}
    filteredBookmarks.forEach(bookmark => {
      const standard = bookmark.standard || 'Unknown'
      if (!grouped[standard]) {
        grouped[standard] = []
      }
      grouped[standard].push(bookmark)
    })
    return grouped
  }

  const groupedBookmarks = groupBookmarksByStandard()

  const getStandardColor = (standard) => {
    if (standard.includes('PMBOK')) return 'blue'
    if (standard.includes('PRINCE2')) return 'green'
    if (standard.includes('ISO')) return 'purple'
    return 'gray'
  }

  const viewInRepository = (bookmarkId) => {
    window.location.hash = `repository-${bookmarkId}`
    
    if (onNavigateToRepository) {
      onNavigateToRepository('repository')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Bookmarks</h2>
          <p className="text-gray-600 mt-1">
            Your saved sections from project management standards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{bookmarks.length} bookmarks</Badge>
          {bookmarks.length > 0 && (
            <Button variant="outline" onClick={() => setShowClearDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {bookmarks.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-6">
            Save sections from the Repository to access them quickly here
          </p>
          <Button onClick={() => {
            window.location.hash = 'repository'
            if (onNavigateToRepository) {
              onNavigateToRepository('repository')
            }
          }}>
            Browse Repository
          </Button>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
                size="sm"
              >
                {category === 'all' ? 'All Categories' : category.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
            ))}
          </div>

          {/* Bookmarks by Standard */}
          <div className="space-y-8">
            {Object.entries(groupedBookmarks).map(([standard, standardBookmarks]) => (
              <div key={standard}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{standard}</h3>
                  <Badge 
                    variant="outline" 
                    className={`border-${getStandardColor(standard)}-300 text-${getStandardColor(standard)}-700`}
                  >
                    {standardBookmarks.length} sections
                  </Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {standardBookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="group hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {bookmark.category}
                              </Badge>
                              <Bookmark className="h-4 w-4 text-yellow-500" />
                            </div>
                            <CardTitle className="text-lg leading-tight">
                              {bookmark.title}
                            </CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBookmark(bookmark.id)}
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {bookmark.content.substring(0, 150)}...
                          </p>
                          <div className="flex justify-between items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewInRepository(bookmark.id)}
                              className="text-blue-600"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Full
                            </Button>
                            <div className="text-xs text-gray-500">
                              Saved {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredBookmarks.length === 0 && selectedCategory !== 'all' && (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookmarks in {selectedCategory}
              </h3>
              <p className="text-gray-600">
                Try selecting a different category or bookmark more sections
              </p>
            </div>
          )}
        </>
      )}

      {/* Tips Card */}
      {bookmarks.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Pro Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Bookmark sections while browsing the Repository for quick access</li>
                  <li>• Use category filters to organize your saved content</li>
                  <li>• Export your bookmarks by copying the localStorage data</li>
                  <li>• Bookmarks are automatically saved to your browser</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Clear All Bookmarks
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all {bookmarks.length} bookmarks? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearAllBookmarks}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Bookmarks