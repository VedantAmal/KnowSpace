import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const workspaceId = searchParams.get("workspace")
  const type = searchParams.get("type") // 'documents', 'threads', or 'all'

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const results = {
      documents: [],
      threads: [],
    }

    // Get user's accessible workspaces
    const { data: workspaces } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id)

    const accessibleWorkspaceIds = workspaces?.map((w) => w.workspace_id) || []

    // Filter by specific workspace if provided
    const searchWorkspaceIds = workspaceId
      ? accessibleWorkspaceIds.filter((id) => id === workspaceId)
      : accessibleWorkspaceIds

    if (searchWorkspaceIds.length === 0) {
      return NextResponse.json(results)
    }

    // Search documents
    if (type === "documents" || type === "all" || !type) {
      const { data: documents } = await supabase
        .from("documents")
        .select(`
          id,
          title,
          content,
          slug,
          created_at,
          is_published,
          workspace_id,
          workspaces (
            name,
            slug
          ),
          profiles (
            display_name
          )
        `)
        .in("workspace_id", searchWorkspaceIds)
        .eq("is_published", true)
        .or(`title.ilike.%${query}%,content::text.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(20)

      results.documents = documents || []
    }

    // Search forum threads
    if (type === "threads" || type === "all" || !type) {
      const { data: threads } = await supabase
        .from("forum_threads")
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          workspace_id,
          workspaces (
            name,
            slug
          ),
          profiles (
            display_name
          ),
          forum_categories (
            name,
            color
          )
        `)
        .in("workspace_id", searchWorkspaceIds)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(20)

      results.threads = threads || []
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
