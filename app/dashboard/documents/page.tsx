import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentsOverview } from "@/components/dashboard/documents-overview"

export default async function DocumentsPage() {
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

  console.log("[v0] Workspaces query result:", { workspaces, workspacesError })

  // Get recent documents across all workspaces
  const workspaceIds = workspaces?.map((w) => w.id) || []

  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select(`
      id,
      title,
      content,
      created_at,
      updated_at,
      author_id,
      workspace_id,
      workspaces (
        name,
        slug
      ),
      profiles (
        display_name,
        email
      )
    `)
    .in("workspace_id", workspaceIds.length > 0 ? workspaceIds : [-1])
    .order("updated_at", { ascending: false })
    .limit(20)

  console.log("[v0] Documents query result:", { documents, documentsError })

  const transformedWorkspaces =
    workspaces?.map((w) => ({
      workspace_id: w.id,
      role: w.owner_id === user.id ? "owner" : "member",
      workspaces: w,
    })) || []

  return (
    <DashboardLayout user={user} workspaces={transformedWorkspaces}>
      <DocumentsOverview documents={documents || []} workspaces={transformedWorkspaces} />
    </DashboardLayout>
  )
}
