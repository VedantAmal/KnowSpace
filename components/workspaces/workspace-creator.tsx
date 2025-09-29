"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface WorkspaceCreatorProps {
  userId: string
}

export function WorkspaceCreator({ userId }: WorkspaceCreatorProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (newName: string) => {
    setName(newName)
    setSlug(generateSlug(newName))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      console.log("[v0] Creating workspace with data:", { name: name.trim(), slug: slug.trim(), userId })

      // Create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          slug: slug.trim(),
          owner_id: userId,
        })
        .select()
        .single()

      if (workspaceError) {
        console.error("[v0] Workspace creation error:", workspaceError)
        if (workspaceError.code === "23505") {
          throw new Error("A workspace with this name already exists. Please choose a different name.")
        }
        throw workspaceError
      }

      console.log("[v0] Workspace created successfully:", workspace)

      // Add creator as owner member
      const { error: memberError } = await supabase.from("workspace_members").insert({
        workspace_id: workspace.id,
        user_id: userId,
        role: "owner",
      })

      if (memberError) {
        console.error("[v0] Member creation error:", memberError)
        throw memberError
      }

      console.log("[v0] Member added successfully")

      // Create default forum category
      const { error: categoryError } = await supabase.from("forum_categories").insert({
        workspace_id: workspace.id,
        name: "General Discussion",
        description: "General topics and announcements",
        color: "#6366f1",
      })

      if (categoryError) {
        console.error("[v0] Category creation error:", categoryError)
        // Don't throw here, category creation is not critical
      }

      console.log("[v0] Redirecting to workspace:", workspace.slug)

      // Redirect to the new workspace
      router.push(`/dashboard/workspaces/${workspace.slug}`)
    } catch (error: any) {
      console.error("[v0] Error creating workspace:", error)
      setError(error.message || "Failed to create workspace")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard/workspaces">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workspaces
          </Button>
        </Link>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Workspace Details</CardTitle>
              <p className="text-sm text-muted-foreground">Set up your collaborative knowledge space</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                placeholder="My Team Workspace"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Choose a descriptive name for your workspace</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                placeholder="my-team-workspace"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be used in your workspace URL: /workspaces/{slug || "your-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workspace is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">Help members understand the purpose of this workspace</p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4">
              <Link href="/dashboard/workspaces">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isCreating || !name.trim() || !slug.trim()}>
                {isCreating ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Private workspace for your team</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Document creation and collaboration</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Forum discussions and categories</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Member management and roles</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Cross-linking between content</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
