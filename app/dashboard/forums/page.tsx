import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ForumOverview } from "@/components/forums/forum-overview"

export default async function ForumsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's workspaces
  const { data: workspaces } = await supabase
    .from("workspace_members")
    .select(`
      workspace_id,
      role,
      workspaces (
        id,
        name,
        description,
        slug
      )
    `)
    .eq("user_id", user.id)

  // Get recent forum threads across all workspaces
  const { data: recentThreads } = await supabase
    .from("forum_threads")
    .select(`
      id,
      title,
      content,
      created_at,
      view_count,
      is_pinned,
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
    .in("workspace_id", workspaces?.map((w) => w.workspace_id) || [])
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <DashboardLayout user={user} workspaces={workspaces || []}>
      <ForumOverview workspaces={workspaces || []} recentThreads={recentThreads || []} />
    </DashboardLayout>
  )
}
