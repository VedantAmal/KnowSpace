"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Users, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DashboardOverviewProps {
  workspaces: any[]
}

export function DashboardOverview({ workspaces }: DashboardOverviewProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to KnowSpace</h1>
        <p className="text-muted-foreground">
          Create, collaborate, and connect your knowledge in one unified workspace.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Create Document</CardTitle>
            <CardDescription>Start writing with our modular block editor</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/documents/new">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5 text-knowledge-secondary" />
            </div>
            <CardTitle className="text-lg">Start Discussion</CardTitle>
            <CardDescription>Begin a threaded conversation with your team</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/forums/new">
              <Button className="w-full bg-transparent" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Discussion
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-knowledge-accent/10 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-knowledge-accent" />
            </div>
            <CardTitle className="text-lg">Create Workspace</CardTitle>
            <CardDescription>Set up a new collaborative workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/workspaces/new">
              <Button className="w-full bg-transparent" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Workspaces</h2>
          <Link href="/dashboard/workspaces">
            <Button variant="ghost">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {workspaces.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Create your first workspace to start organizing your knowledge and collaborating with others.
              </p>
              <Link href="/dashboard/workspaces/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workspace
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.slice(0, 6).map((workspace) => (
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
                    <Link href={`/dashboard/workspaces/${workspace.workspaces.slug}`}>
                      <Button size="sm" variant="outline">
                        Open
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

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
            <p className="text-muted-foreground text-center">
              Start creating documents and discussions to see your activity here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
