import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sourceType, sourceId, targetType, targetId, workspaceId } = body

    // Validate required fields
    if (!sourceType || !sourceId || !targetType || !targetId || !workspaceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

    // Create the link
    const { data: link, error } = await supabase
      .from("content_links")
      .insert({
        source_type: sourceType,
        source_id: sourceId,
        target_type: targetType,
        target_id: targetId,
        workspace_id: workspaceId,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating link:", error)
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
    }

    return NextResponse.json({ link })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const sourceType = searchParams.get("sourceType")
    const sourceId = searchParams.get("sourceId")
    const workspaceId = searchParams.get("workspaceId")

    if (!sourceType || !sourceId || !workspaceId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
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

    // Get links for the content
    const { data: links, error } = await supabase
      .from("content_links")
      .select(`
        *,
        documents:target_id(title, slug),
        forum_threads:target_id(title)
      `)
      .eq("source_type", sourceType)
      .eq("source_id", sourceId)
      .eq("workspace_id", workspaceId)

    if (error) {
      console.error("Error fetching links:", error)
      return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
    }

    return NextResponse.json({ links })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
