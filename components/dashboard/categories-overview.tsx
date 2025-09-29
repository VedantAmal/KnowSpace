"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Search, Hash } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface CategoriesOverviewProps {
  categories: any[]
  threadCounts: Record<string, number>
  workspaces: any[]
}

export function CategoriesOverview({ categories, threadCounts, workspaces }: CategoriesOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all")

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesWorkspace = selectedWorkspace === "all" || category.workspace_id === selectedWorkspace
    return matchesSearch && matchesWorkspace
  })

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      green: "bg-green-500/10 text-green-500 border-green-500/20",
      purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      red: "bg-red-500/10 text-red-500 border-red-500/20",
      yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    }
    return colorMap[color] || "bg-muted text-muted-foreground border-border"
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Browse discussion categories across your workspaces</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedWorkspace}
          onChange={(e) => setSelectedWorkspace(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">All Workspaces</option>
          {workspaces.map((workspace) => (
            <option key={workspace.workspace_id} value={workspace.workspace_id}>
              {workspace.workspaces.name}
            </option>
          ))}
        </select>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Hash className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No categories found" : "No categories yet"}</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "Categories help organize discussions in your workspaces"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full border ${getColorClass(category.color)}`} />
                      <CardTitle className="text-lg">
                        <Link
                          href={`/dashboard/workspaces/${category.workspaces.slug}/forums?category=${category.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      </CardTitle>
                    </div>
                    <CardDescription className="mb-2">{category.description || "No description"}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {threadCounts[category.id] || 0} discussions
                      </span>
                      <span className="text-primary">{category.workspaces.name}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
