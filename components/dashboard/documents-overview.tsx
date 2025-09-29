"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Plus, Search, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface DocumentsOverviewProps {
  documents: any[]
  workspaces: any[]
}

export function DocumentsOverview({ documents, workspaces }: DocumentsOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesWorkspace = selectedWorkspace === "all" || doc.workspace_id === selectedWorkspace
    return matchesSearch && matchesWorkspace
  })

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your knowledge documents</p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedWorkspace}
          onChange={(e) => setSelectedWorkspace(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">All Workspaces</option>
          {workspaces.map((workspace) => (
            <option key={workspace.workspace_id} value={workspace.workspace_id}>
              {workspace.workspaces.name}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No documents found" : "No documents yet"}</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "Create your first document to start building your knowledge base"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/documents/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredDocuments.map((document) => (
            <Card
              key={document.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      <Link
                        href={`/dashboard/workspaces/${document.workspaces.slug}/documents/${document.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {document.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {document.profiles?.display_name || document.profiles?.email || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                      </span>
                      <span className="text-primary">{document.workspaces.name}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {document.content && (
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{document.content.substring(0, 200)}...</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
