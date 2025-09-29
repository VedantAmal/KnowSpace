"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Pin, Eye, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ForumOverviewProps {
  workspaces: any[]
  recentThreads: any[]
}

export function ForumOverview({ workspaces, recentThreads }: ForumOverviewProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forums</h1>
          <p className="text-muted-foreground">Engage in collaborative discussions across your workspaces.</p>
        </div>
        <Link href="/dashboard/forums/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5 text-knowledge-secondary" />
            </div>
            <CardTitle className="text-lg">Start Discussion</CardTitle>
            <CardDescription>Create a new threaded discussion</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/forums/new">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                New Thread
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Browse Categories</CardTitle>
            <CardDescription>Explore organized discussion topics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/forums/categories">
              <Button className="w-full bg-transparent" variant="outline">
                View Categories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-knowledge-accent/10 rounded-lg flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-knowledge-accent" />
            </div>
            <CardTitle className="text-lg">My Activity</CardTitle>
            <CardDescription>View your posts and replies</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/forums/my-activity">
              <Button className="w-full bg-transparent" variant="outline">
                View Activity
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Discussions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Discussions</h2>
          <Link href="/dashboard/forums/all">
            <Button variant="ghost">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {recentThreads.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Start the conversation by creating your first discussion thread.
              </p>
              <Link href="/dashboard/forums/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Discussion
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <Card
                key={thread.id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {thread.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          <Link href={`/dashboard/workspaces/${thread.workspaces.slug}/forums/${thread.id}`}>
                            {thread.title}
                          </Link>
                        </h3>
                        {thread.forum_categories && (
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: `${thread.forum_categories.color}20`,
                              color: thread.forum_categories.color,
                            }}
                          >
                            {thread.forum_categories.name}
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {thread.content.substring(0, 150)}...
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>by {thread.profiles.display_name}</span>
                        <span>in {thread.workspaces.name}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{thread.view_count}</span>
                        </div>
                        <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Forums */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Workspace Forums</h2>
        {workspaces.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
              <p className="text-muted-foreground text-center">
                Join or create a workspace to start participating in discussions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.workspace_id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{workspace.workspaces.name}</CardTitle>
                  <CardDescription>{workspace.workspaces.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{workspace.role}</span>
                    <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}/forums`}>
                      <Button size="sm" variant="outline">
                        View Forum
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
