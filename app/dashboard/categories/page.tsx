import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CategoriesOverview } from "@/components/dashboard/categories-overview"

export default async function CategoriesPage() {
  const supabase = createServerClient()

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

  console.log("[v0] Categories workspaces query result:", { workspaces, workspacesError })

  const workspaceIds = workspaces?.map((w) => w.id) || []

  // Get forum categories across all workspaces
  const { data: categories } = await supabase
    .from("forum_categories")
    .select(`
      id,
      name,
      description,
      color,
      workspace_id,
      created_at,
      workspaces (
        name,
        slug
      )
    `)
    .in("workspace_id", workspaceIds.length > 0 ? workspaceIds : [-1])
    .order("name")

  // Get thread counts for each category
  const { data: threadCounts } = await supabase
    .from("forum_threads")
    .select("category_id")
    .in("workspace_id", workspaceIds.length > 0 ? workspaceIds : [-1])

  const categoryThreadCounts =
    threadCounts?.reduce(
      (acc, thread) => {
        acc[thread.category_id] = (acc[thread.category_id] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const transformedWorkspaces =
    workspaces?.map((w) => ({
      workspace_id: w.id,
      role: w.owner_id === user.id ? "owner" : "member",
      workspaces: w,
    })) || []

  return (
    <DashboardLayout user={user} workspaces={transformedWorkspaces}>
      <CategoriesOverview
        categories={categories || []}
        threadCounts={categoryThreadCounts}
        workspaces={transformedWorkspaces}
      />
    </DashboardLayout>
  )
}
