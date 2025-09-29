"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Settings, Crown, Shield, User, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface WorkspacesOverviewProps {
  workspaces: any[]
  currentUserId: string
}

export function WorkspacesOverview({ workspaces, currentUserId }: WorkspacesOverviewProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "admin":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Workspaces</h1>
          <p className="text-muted-foreground">Manage and collaborate in your knowledge workspaces.</p>
        </div>
        <Link href="/dashboard/workspaces/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workspace
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workspaces.length}</p>
                <p className="text-sm text-muted-foreground">Total Workspaces</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-knowledge-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workspaces.filter((w) => w.role === "owner").length}</p>
                <p className="text-sm text-muted-foreground">Owned by You</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-knowledge-accent/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-knowledge-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workspaces.reduce((sum, w) => sum + w.memberCount, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces Grid */}
      {workspaces.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No workspaces yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first workspace to start organizing your knowledge and collaborating with others.
            </p>
            <Link href="/dashboard/workspaces/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Workspace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.workspace_id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}`}>
                          {workspace.workspaces.name}
                        </Link>
                      </CardTitle>
                      <Badge variant={getRoleBadgeVariant(workspace.role)} className="flex items-center space-x-1">
                        {getRoleIcon(workspace.role)}
                        <span className="capitalize">{workspace.role}</span>
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {workspace.workspaces.description || "No description provided"}
                    </CardDescription>
                  </div>

                  {workspace.role === "owner" && (
                    <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}/settings`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{workspace.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDistanceToNow(new Date(workspace.joined_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created by {workspace.workspaces.profiles.display_name}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}/documents`}>
                        <Button variant="ghost" size="sm">
                          Documents
                        </Button>
                      </Link>
                      <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}/forums`}>
                        <Button variant="ghost" size="sm">
                          Forums
                        </Button>
                      </Link>
                    </div>

                    <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}`}>
                      <Button size="sm" variant="outline">
                        Open
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
