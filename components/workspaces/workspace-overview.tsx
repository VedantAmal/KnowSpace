"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, MessageSquare, Users, Plus, Settings, Crown, Shield, User, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface WorkspaceOverviewProps {
  workspace: any
  membership: any
  stats: {
    documentCount: number
    threadCount: number
    memberCount: number
  }
  recentDocuments: any[]
  recentThreads: any[]
  members: any[]
  currentUser: any
}

export function WorkspaceOverview({
  workspace,
  membership,
  stats,
  recentDocuments,
  recentThreads,
  members,
  currentUser,
}: WorkspaceOverviewProps) {
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

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  const canManage = ["owner", "admin"].includes(membership.role)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold">{workspace.name}</h1>
            <Badge variant="secondary" className="flex items-center space-x-1">
              {getRoleIcon(membership.role)}
              <span className="capitalize">{membership.role}</span>
            </Badge>
          </div>
          <p className="text-muted-foreground mb-2">{workspace.description || "No description provided"}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Created by {workspace.profiles.display_name}</span>
            <span>•</span>
            <span>You joined {formatDistanceToNow(new Date(membership.joined_at), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {canManage && (
            <Link href={`/dashboard/workspaces/${workspace.slug}/settings`}>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          )}
          <Link href={`/dashboard/workspaces/${workspace.slug}/members`}>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Members
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.documentCount}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-knowledge-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.threadCount}</p>
                <p className="text-sm text-muted-foreground">Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-knowledge-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-knowledge-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.memberCount}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create Document</CardTitle>
                  <CardDescription>Write structured content</CardDescription>
                </div>
              </div>
              <Link href={`/dashboard/workspaces/${workspace.slug}/documents/new`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-knowledge-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Start Discussion</CardTitle>
                  <CardDescription>Begin a conversation</CardDescription>
                </div>
              </div>
              <Link href={`/dashboard/workspaces/${workspace.slug}/forums/new`}>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Documents</h2>
            <Link href={`/dashboard/workspaces/${workspace.slug}/documents`}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              {recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No documents yet</p>
                  <Link href={`/dashboard/workspaces/${workspace.slug}/documents/new`}>
                    <Button size="sm" className="mt-2">
                      Create First Document
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <Link
                          href={`/dashboard/workspaces/${workspace.slug}/documents/${doc.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {doc.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by {doc.profiles.display_name} •{" "}
                          {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Discussions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Discussions</h2>
            <Link href={`/dashboard/workspaces/${workspace.slug}/forums`}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              {recentThreads.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No discussions yet</p>
                  <Link href={`/dashboard/workspaces/${workspace.slug}/forums/new`}>
                    <Button size="sm" className="mt-2">
                      Start First Discussion
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <Link
                          href={`/dashboard/workspaces/${workspace.slug}/forums/${thread.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {thread.title}
                        </Link>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                          <span>by {thread.profiles.display_name}</span>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{thread.view_count}</span>
                          </div>
                          <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Link href={`/dashboard/workspaces/${workspace.slug}/members`}>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(member.profiles.display_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.profiles.display_name}</p>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className="text-sm text-muted-foreground capitalize">{member.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
