"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LinkSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (link: { type: "document" | "thread" | "external"; url: string; title: string }) => void
  workspaceId?: string
}

export function LinkSelector({ open, onOpenChange, onSelect, workspaceId }: LinkSelectorProps) {
  const [query, setQuery] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [linkTitle, setLinkTitle] = useState("")
  const [results, setResults] = useState<any>({ documents: [], threads: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"internal" | "external">("internal")

  useEffect(() => {
    if (!query.trim() || activeTab !== "internal") {
      setResults({ documents: [], threads: [] })
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          type: "all",
        })

        if (workspaceId) {
          params.append("workspace", workspaceId)
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
  }, [query, workspaceId, activeTab])

  const handleInternalSelect = (item: any, type: "document" | "thread") => {
    const url =
      type === "document"
        ? `/dashboard/workspaces/${item.workspaces.slug}/documents/${item.slug}`
        : `/dashboard/workspaces/${item.workspaces.slug}/forums/${item.id}`

    onSelect({
      type,
      url,
      title: item.title,
    })

    handleClose()
  }

  const handleExternalSelect = () => {
    if (!externalUrl.trim()) return

    onSelect({
      type: "external",
      url: externalUrl.trim(),
      title: linkTitle.trim() || externalUrl.trim(),
    })

    handleClose()
  }

  const handleClose = () => {
    setQuery("")
    setExternalUrl("")
    setLinkTitle("")
    setResults({ documents: [], threads: [] })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tab Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === "internal" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("internal")}
            >
              Internal Link
            </Button>
            <Button
              variant={activeTab === "external" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("external")}
            >
              External Link
            </Button>
          </div>

          {/* Internal Link Tab */}
          {activeTab === "internal" && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Search documents and discussions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {isLoading && <div className="text-center py-4 text-muted-foreground">Searching...</div>}

              {!isLoading && query && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Documents */}
                  {results.documents?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Documents</h4>
                      <div className="space-y-2">
                        {results.documents.map((doc: any) => (
                          <button
                            key={doc.id}
                            onClick={() => handleInternalSelect(doc, "document")}
                            className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-sm text-muted-foreground">in {doc.workspaces?.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Forum Threads */}
                  {results.threads?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Discussions</h4>
                      <div className="space-y-2">
                        {results.threads.map((thread: any) => (
                          <button
                            key={thread.id}
                            onClick={() => handleInternalSelect(thread, "thread")}
                            className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">{thread.title}</div>
                            <div className="text-sm text-muted-foreground">
                              in {thread.workspaces?.name} • {thread.category}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {query && !isLoading && results.documents?.length === 0 && results.threads?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No results found for "{query}"</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* External Link Tab */}
          {activeTab === "external" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link Text (optional)</label>
                <input
                  type="text"
                  placeholder="Custom link text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button onClick={handleExternalSelect} disabled={!externalUrl.trim()} className="w-full">
                Add External Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
