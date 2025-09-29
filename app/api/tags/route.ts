import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get("workspaceId")
    const type = searchParams.get("type") // "documents" | "threads" | "all"

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    }

    // Check workspace access
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const tags: string[] = []

    if (type === "documents" || type === "all") {
      const { data: docTags } = await supabase
        .from("documents")
        .select("tags")
        .eq("workspace_id", workspaceId)
        .not("tags", "is", null)

      if (docTags) {
        docTags.forEach((doc) => {
          if (doc.tags) {
            tags.push(...doc.tags)
          }
        })
      }
    }

    if (type === "threads" || type === "all") {
      const { data: threadTags } = await supabase
        .from("forum_threads")
        .select("tags")
        .eq("workspace_id", workspaceId)
        .not("tags", "is", null)

      if (threadTags) {
        threadTags.forEach((thread) => {
          if (thread.tags) {
            tags.push(...thread.tags)
          }
        })
      }
    }

    // Get unique tags and their counts
    const tagCounts = tags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const uniqueTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([tag, count]) => ({ tag, count }))

    return NextResponse.json({ tags: uniqueTags })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
