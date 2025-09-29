import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { WorkspaceOverview } from "@/components/workspaces/workspace-overview"

interface WorkspacePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select(`
      *,
      profiles!workspaces_owner_id_fkey (
        display_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .single()

  if (!workspace) {
    notFound()
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    redirect("/dashboard")
  }

  // Get workspace stats
  const [
    { count: documentCount },
    { count: threadCount },
    { count: memberCount },
    { data: recentDocuments },
    { data: recentThreads },
    { data: members },
  ] = await Promise.all([
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase.from("forum_threads").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase.from("workspace_members").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase
      .from("documents")
      .select(`
        id,
        title,
        created_at,
        slug,
        profiles (display_name)
      `)
      .eq("workspace_id", workspace.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("forum_threads")
      .select(`
        id,
        title,
        created_at,
        view_count,
        profiles (display_name)
      `)
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("workspace_members")
      .select(`
        role,
        joined_at,
        profiles (
          display_name,
          avatar_url
        )
      `)
      .eq("workspace_id", workspace.id)
      .order("joined_at", { ascending: false })
      .limit(8),
  ])

  // Get user's workspaces for layout
  const { data: workspaces } = await supabase
    .from("workspace_members")
    .select(`
      workspace_id,
      role,
      workspaces (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", user.id)

  return (
    <DashboardLayout user={user} workspaces={workspaces || []}>
      <WorkspaceOverview
        workspace={workspace}
        membership={membership}
        stats={{
          documentCount: documentCount || 0,
          threadCount: threadCount || 0,
          memberCount: memberCount || 0,
        }}
        recentDocuments={recentDocuments || []}
        recentThreads={recentThreads || []}
        members={members || []}
        currentUser={user}
      />
    </DashboardLayout>
  )
}
