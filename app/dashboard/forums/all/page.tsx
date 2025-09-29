"use client"

import { useState, useEffect } from "react"
import { ContentFilters } from "@/components/filters/content-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { MessageSquare, Pin, Eye, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function AllForumsPage() {
  const [threads, setThreads] = useState<any[]>([])
  const [filteredThreads, setFilteredThreads] = useState<any[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchThreads()
    fetchFilterData()
  }, [])

  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_threads")
        .select(`
          *,
          profiles:author_id(display_name, avatar_url),
          workspaces(name, slug),
          forum_categories(name, color)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setThreads(data || [])
      setFilteredThreads(data || [])
    } catch (error) {
      console.error("Error fetching threads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilterData = async () => {
    try {
      // Fetch available tags
      const { data: tagsData } = await supabase.from("forum_threads").select("tags").not("tags", "is", null)

      const allTags = new Set<string>()
      tagsData?.forEach((thread) => {
        if (thread.tags) {
          thread.tags.forEach((tag: string) => allTags.add(tag))
        }
      })
      setAvailableTags(Array.from(allTags))

      // Fetch categories
      const { data: categoriesData } = await supabase.from("forum_categories").select("name")

      setAvailableCategories(categoriesData?.map((cat) => cat.name) || [])

      // Fetch authors
      const { data: authorsData } = await supabase.from("profiles").select("display_name")

      setAvailableAuthors(authorsData?.map((author) => author.display_name) || [])
    } catch (error) {
      console.error("Error fetching filter data:", error)
    }
  }

  const handleFiltersChange = (filters: any) => {
    let filtered = [...threads]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (thread) =>
          thread.title.toLowerCase().includes(searchLower) || thread.content.toLowerCase().includes(searchLower),
      )
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(
        (thread) => thread.tags && filters.tags.some((tag: string) => thread.tags.includes(tag)),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((thread) => thread.forum_categories?.name === filters.category)
    }

    // Author filter
    if (filters.author !== "all") {
      filtered = filtered.filter((thread) => thread.profiles?.display_name === filters.author)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      if (filters.dateRange !== "all") {
        filtered = filtered.filter((thread) => new Date(thread.created_at) >= filterDate)
      }
    }

    // Sort
    switch (filters.sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "replies":
        filtered.sort((a, b) => (b.reply_count || 0) - (a.reply_count || 0))
        break
      case "votes":
        filtered.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
        break
      default: // recent
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredThreads(filtered)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading discussions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/forums">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forums
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">All Discussions</h1>
            <p className="text-muted-foreground">
              {filteredThreads.length} of {threads.length} discussions
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ContentFilters
          onFiltersChange={handleFiltersChange}
          availableTags={availableTags}
          availableCategories={availableCategories}
          availableAuthors={availableAuthors}
          contentType="threads"
        />
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters or create a new discussion.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredThreads.map((thread) => (
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

                    {/* Tags */}
                    {thread.tags && thread.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {thread.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>by {thread.profiles.display_name}</span>
                      <span>in {thread.workspaces.name}</span>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{thread.view_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
