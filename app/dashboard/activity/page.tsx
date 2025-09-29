import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ActivityOverview } from "@/components/dashboard/activity-overview"

export default async function ActivityPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/signin")
  }

  const { data: workspaces, error: workspacesError } = await supabase.from("workspaces").select(`
      id,
      name,
      slug,
      description,
      owner_id
    `)

  console.log("[v0] Activity workspaces query result:", { workspaces, workspacesError })

  const workspaceIds = workspaces?.map((w) => w.id) || []

  // Get recent documents created/updated by user
  const { data: recentDocuments } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      created_at,
      updated_at,
      workspace_id,
      workspaces (name, slug)
    `)
    .eq("author_id", user.id)
    .in("workspace_id", workspaceIds.length > 0 ? workspaceIds : [-1])
    .order("updated_at", { ascending: false })
    .limit(10)

  // Get recent forum posts by user
  const { data: recentPosts } = await supabase
    .from("forum_posts")
    .select(`
      id,
      content,
      created_at,
      thread_id,
      forum_threads (
        id,
        title,
        workspace_id,
        workspaces (name, slug)
      )
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get recent forum threads created by user
  const { data: recentThreads } = await supabase
    .from("forum_threads")
    .select(`
      id,
      title,
      created_at,
      workspace_id,
      workspaces (name, slug)
    `)
    .eq("author_id", user.id)
    .in("workspace_id", workspaceIds.length > 0 ? workspaceIds : [-1])
    .order("created_at", { ascending: false })
    .limit(10)

  const transformedWorkspaces =
    workspaces?.map((w) => ({
      workspace_id: w.id,
      role: w.owner_id === user.id ? "owner" : "member",
      workspaces: w,
    })) || []

  return (
    <DashboardLayout user={user} workspaces={transformedWorkspaces}>
      <ActivityOverview
        recentDocuments={recentDocuments || []}
        recentPosts={recentPosts || []}
        recentThreads={recentThreads || []}
      />
    </DashboardLayout>
  )
}
