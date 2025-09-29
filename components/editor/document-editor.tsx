"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlockEditor } from "./block-editor"
import { TagInput } from "@/components/ui/tag-input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Save, Eye } from "lucide-react"

interface DocumentEditorProps {
  workspaces: any[]
  userId: string
  document?: any
}

export function DocumentEditor({ workspaces, userId, document }: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title || "")
  const [selectedWorkspace, setSelectedWorkspace] = useState(document?.workspace_id || "")
  const [content, setContent] = useState(document?.content || [])
  const [isPublished, setIsPublished] = useState(document?.is_published || false)
  const [isSaving, setIsSaving] = useState(false)
  const [slug, setSlug] = useState(document?.slug || "")
  const [tags, setTags] = useState<string[]>(document?.tags || [])

  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!document) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSave = async (publish = false) => {
    if (!title.trim() || !selectedWorkspace) {
      return
    }

    setIsSaving(true)

    try {
      const documentData = {
        title: title.trim(),
        content,
        workspace_id: selectedWorkspace,
        author_id: userId,
        slug: slug || generateSlug(title),
        is_published: publish,
        tags: tags.length > 0 ? tags : null,
      }

      if (document) {
        const { error } = await supabase.from("documents").update(documentData).eq("id", document.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("documents").insert(documentData).select().single()

        if (error) throw error

        const workspace = workspaces.find((w) => w.workspace_id === selectedWorkspace)
        router.push(`/dashboard/workspaces/${workspace?.workspaces.slug}/documents/${data.slug}`)
      }
    } catch (error) {
      console.error("Error saving document:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter document title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace</Label>
              <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.workspace_id} value={workspace.workspace_id}>
                      {workspace.workspaces.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {slug && (
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="document-url-slug" />
            </div>
          )}

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder="Add tags to help organize and find this document..."
              maxTags={8}
            />
            <p className="text-xs text-muted-foreground">
              Add relevant tags to make your document easier to find and organize.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Content</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(false)}
                  disabled={isSaving || !title.trim() || !selectedWorkspace}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSave(true)}
                  disabled={isSaving || !title.trim() || !selectedWorkspace}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isSaving ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BlockEditor content={content} onChange={setContent} placeholder="Start writing your document..." />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
