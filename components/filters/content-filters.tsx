"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X, Search } from "lucide-react"

interface ContentFiltersProps {
  onFiltersChange: (filters: {
    search: string
    tags: string[]
    category: string
    author: string
    dateRange: string
    sortBy: string
  }) => void
  availableTags?: string[]
  availableCategories?: string[]
  availableAuthors?: string[]
  contentType: "documents" | "threads" | "all"
}

export function ContentFilters({
  onFiltersChange,
  availableTags = [],
  availableCategories = [],
  availableAuthors = [],
  contentType,
}: ContentFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    tags: [] as string[],
    category: "all",
    author: "all",
    dateRange: "all",
    sortBy: "recent",
  })

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter("tags", [...filters.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter(
      "tags",
      filters.tags.filter((t) => t !== tag),
    )
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      tags: [],
      category: "all",
      author: "all",
      dateRange: "all",
      sortBy: "recent",
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.tags.length > 0 ||
    filters.category !== "all" ||
    filters.author !== "all" ||
    filters.dateRange !== "all"

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${contentType}...`}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {(filters.tags.length > 0 ? 1 : 0) +
                (filters.category !== "all" ? 1 : 0) +
                (filters.author !== "all" ? 1 : 0) +
                (filters.dateRange !== "all" ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <button onClick={() => removeTag(tag)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <button onClick={() => updateFilter("category", "all")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.author !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Author: {filters.author}
              <button onClick={() => updateFilter("author", "all")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.dateRange !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.dateRange}
              <button onClick={() => updateFilter("dateRange", "all")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-border rounded-lg bg-muted/50">
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="space-y-2">
              {availableTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={filters.tags.includes(tag)}
                  className="block w-full text-left px-2 py-1 text-sm rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          {availableCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Author */}
          {availableAuthors.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <Select value={filters.author} onValueChange={(value) => updateFilter("author", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All authors</SelectItem>
                  {availableAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                {contentType === "threads" && (
                  <>
                    <SelectItem value="replies">Most replies</SelectItem>
                    <SelectItem value="votes">Most votes</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
