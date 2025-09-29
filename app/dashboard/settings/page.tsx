"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { User, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      setDisplayName(user.user_metadata?.display_name || "")
      setEmail(user.email || "")

      // Fetch workspaces
      const { data: workspaceData } = await supabase
        .from("workspace_members")
        .select(`
          *,
          workspaces(*)
        `)
        .eq("user_id", user.id)

      setWorkspaces(workspaceData || [])
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      })

      if (error) throw error

      // Update profile in database
      await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      // Note: In a real app, you'd want to handle this server-side
      // This is a simplified version for demonstration
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout user={user} workspaces={workspaces}>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading settings...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const userInitials =
    displayName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "U"

  return (
    <DashboardLayout user={user} workspaces={workspaces}>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>Update your personal information and profile settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{displayName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed from this interface.</p>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Workspace Memberships */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Workspace Memberships</CardTitle>
              <CardDescription>Workspaces you're a member of and your roles.</CardDescription>
            </CardHeader>
            <CardContent>
              {workspaces.length === 0 ? (
                <p className="text-muted-foreground">You're not a member of any workspaces yet.</p>
              ) : (
                <div className="space-y-4">
                  {workspaces.map((membership) => (
                    <div
                      key={membership.workspace_id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{membership.workspaces.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {membership.workspaces.description || "No description"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium capitalize">{membership.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <h4 className="font-medium text-destructive">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
