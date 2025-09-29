"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ActivityOverviewProps {
  recentDocuments: any[]
  recentPosts: any[]
  recentThreads: any[]
}

export function ActivityOverview({ recentDocuments, recentPosts, recentThreads }: ActivityOverviewProps) {
  // Combine and sort all activities by date
  const allActivities = [
    ...recentDocuments.map((doc) => ({
      type: "document",
      id: doc.id,
      title: doc.title,
      date: doc.updated_at,
      workspace: doc.workspaces,
      link: `/dashboard/workspaces/${doc.workspaces.slug}/documents/${doc.id}`,
    })),
    ...recentThreads.map((thread) => ({
      type: "thread",
      id: thread.id,
      title: thread.title,
      date: thread.created_at,
      workspace: thread.workspaces,
      link: `/dashboard/workspaces/${thread.workspaces.slug}/forums/${thread.id}`,
    })),
    ...recentPosts.map((post) => ({
      type: "post",
      id: post.id,
      title: `Reply in "${post.forum_threads.title}"`,
      date: post.created_at,
      workspace: post.forum_threads.workspaces,
      link: `/dashboard/workspaces/${post.forum_threads.workspaces.slug}/forums/${post.thread_id}`,
      content: post.content,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document":
        return <BookOpen className="w-4 h-4 text-primary" />
      case "thread":
        return <MessageSquare className="w-4 h-4 text-knowledge-secondary" />
      case "post":
        return <MessageSquare className="w-4 h-4 text-knowledge-accent" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "document":
        return "Document"
      case "thread":
        return "Discussion"
      case "post":
        return "Reply"
      default:
        return "Activity"
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Activity</h1>
        <p className="text-muted-foreground">Track your recent contributions and activities across all workspaces</p>
      </div>

      {/* Activity Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDocuments.length}</div>
            <p className="text-xs text-muted-foreground">Recent documents</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Discussions</CardTitle>
              <MessageSquare className="w-4 h-4 text-knowledge-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentThreads.length}</div>
            <p className="text-xs text-muted-foreground">Started discussions</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Replies</CardTitle>
              <MessageSquare className="w-4 h-4 text-knowledge-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPosts.length}</div>
            <p className="text-xs text-muted-foreground">Forum replies</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>

        {allActivities.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
              <p className="text-muted-foreground text-center">
                Start creating documents and participating in discussions to see your activity here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allActivities.slice(0, 20).map((activity, index) => (
              <Card
                key={`${activity.type}-${activity.id}-${index}`}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">
                          {getActivityTypeLabel(activity.type)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                        </span>
                        <span className="text-xs text-primary">{activity.workspace.name}</span>
                      </div>
                      <h4 className="font-medium mb-1 truncate">{activity.title}</h4>
                      {activity.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activity.content.substring(0, 150)}...
                        </p>
                      )}
                    </div>
                    <Link href={activity.link} className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
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
