"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagInput } from "@/components/ui/tag-input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Send, Pin } from "lucide-react"

interface ThreadEditorProps {
  workspaces: any[]
  categories: any[]
  userId: string
  thread?: any
}

export function ThreadEditor({ workspaces, categories, userId, thread }: ThreadEditorProps) {
  const [title, setTitle] = useState(thread?.title || "")
  const [content, setContent] = useState(thread?.content || "")
  const [selectedWorkspace, setSelectedWorkspace] = useState(thread?.workspace_id || "defaultWorkspace")
  const [selectedCategory, setSelectedCategory] = useState(thread?.category_id || "noCategory")
  const [isPinned, setIsPinned] = useState(thread?.is_pinned || false)
  const [tags, setTags] = useState<string[]>(thread?.tags || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const workspaceCategories = categories.filter((cat) => cat.workspace_id === selectedWorkspace)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !selectedWorkspace) {
      return
    }

    setIsSubmitting(true)

    try {
      const threadData = {
        title: title.trim(),
        content: content.trim(),
        workspace_id: selectedWorkspace,
        category_id: selectedCategory || null,
        author_id: userId,
        is_pinned: isPinned,
        tags: tags.length > 0 ? tags : null,
      }

      if (thread) {
        const { error } = await supabase.from("forum_threads").update(threadData).eq("id", thread.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("forum_threads").insert(threadData).select().single()

        if (error) throw error

        const workspace = workspaces.find((w) => w.workspace_id === selectedWorkspace)
        router.push(`/dashboard/workspaces/${workspace?.workspaces.slug}/forums/${data.id}`)
      }
    } catch (error) {
      console.error("Error saving thread:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Discussion Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noCategory">No category</SelectItem>
                    {workspaceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What would you like to discuss?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, ask questions, or start a conversation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder="Add tags to help categorize this discussion..."
                maxTags={6}
              />
              <p className="text-xs text-muted-foreground">
                Add relevant tags to help others find and categorize this discussion.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded"
                />
                <Pin className="w-4 h-4" />
                <span className="text-sm">Pin this discussion</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim() || !selectedWorkspace}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Publishing..." : "Publish Discussion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
