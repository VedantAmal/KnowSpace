import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { WorkspaceCreator } from "@/components/workspaces/workspace-creator"

export default async function NewWorkspacePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: workspaces, error: workspacesError } = await supabase
    .from("workspaces")
    .select(`
      id,
      name,
      slug,
      description,
      owner_id
    `)
    .eq("owner_id", user.id)

  console.log("[v0] New workspace page workspaces query result:", { workspaces, workspacesError })

  const transformedWorkspaces =
    workspaces?.map((w) => ({
      workspace_id: w.id,
      role: "owner",
      workspaces: w,
    })) || []

  return (
    <DashboardLayout user={user} workspaces={transformedWorkspaces}>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New Workspace</h1>
          <p className="text-muted-foreground">
            Set up a collaborative space for your team's knowledge and discussions.
          </p>
        </div>

        <WorkspaceCreator userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
