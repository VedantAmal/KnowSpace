"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, BookOpen, MessageSquare, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceSlug?: string
}

export function SearchDialog({ open, onOpenChange, workspaceSlug }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>({ documents: [], threads: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<"all" | "documents" | "threads">("all")

  useEffect(() => {
    if (!query.trim()) {
      setResults({ documents: [], threads: [] })
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          type: selectedType,
        })

        if (workspaceSlug) {
          // Get workspace ID from slug - in a real app, you'd want to cache this
          params.append("workspace", workspaceSlug)
        }

        const response = await fetch(`/api/search?${params}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query, selectedType, workspaceSlug])

  const handleClose = () => {
    setQuery("")
    setResults({ documents: [], threads: [] })
    onOpenChange(false)
  }

  const totalResults = results.documents.length + results.threads.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Knowledge</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents and discussions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
            >
              All
            </Button>
            <Button
              variant={selectedType === "documents" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("documents")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Documents
            </Button>
            <Button
              variant={selectedType === "threads" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("threads")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussions
            </Button>
          </div>

          {/* Results */}
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : query.trim() && totalResults === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm">Try different keywords or check your spelling</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Documents */}
                {results.documents.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Documents ({results.documents.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {results.documents.map((doc: any) => (
                        <Link
                          key={doc.id}
                          href={`/dashboard/workspaces/${doc.workspaces.slug}/documents/${doc.slug}`}
                          onClick={handleClose}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{doc.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {typeof doc.content === "string"
                                  ? doc.content.substring(0, 150) + "..."
                                  : "Document content"}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                <span>by {doc.profiles.display_name}</span>
                                <span>in {doc.workspaces.name}</span>
                                <span>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Forum Threads */}
                {results.threads.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Discussions ({results.threads.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {results.threads.map((thread: any) => (
                        <Link
                          key={thread.id}
                          href={`/dashboard/workspaces/${thread.workspaces.slug}/forums/${thread.id}`}
                          onClick={handleClose}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{thread.title}</h4>
                                {thread.forum_categories && (
                                  <Badge
                                    variant="secondary"
                                    style={{
                                      backgroundColor: `${thread.forum_categories.color}20`,
                                      color: thread.forum_categories.color,
                                    }}
                                  >
                                    {thread.forum_categories.name}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {thread.content.substring(0, 150)}...
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                <span>by {thread.profiles.display_name}</span>
                                <span>in {thread.workspaces.name}</span>
                                <span>{thread.view_count} views</span>
                                <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
