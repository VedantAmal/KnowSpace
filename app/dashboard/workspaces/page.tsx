import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { WorkspacesOverview } from "@/components/workspaces/workspaces-overview"

export default async function WorkspacesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's workspaces with member counts
  const { data: workspaces } = await supabase
    .from("workspace_members")
    .select(`
      workspace_id,
      role,
      joined_at,
      workspaces (
        id,
        name,
        description,
        slug,
        created_at,
        owner_id,
        profiles!workspaces_owner_id_fkey (
          display_name
        )
      )
    `)
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })

  // Get member counts for each workspace
  const workspaceIds = workspaces?.map((w) => w.workspace_id) || []
  const { data: memberCounts } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .in("workspace_id", workspaceIds)

  const workspacesWithCounts =
    workspaces?.map((workspace) => ({
      ...workspace,
      memberCount: memberCounts?.filter((m) => m.workspace_id === workspace.workspace_id).length || 0,
    })) || []

  return (
    <DashboardLayout user={user} workspaces={workspaces || []}>
      <WorkspacesOverview workspaces={workspacesWithCounts} currentUserId={user.id} />
    </DashboardLayout>
  )
}
