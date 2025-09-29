"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-3 bg-muted rounded-md text-sm">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{error.message}</pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
