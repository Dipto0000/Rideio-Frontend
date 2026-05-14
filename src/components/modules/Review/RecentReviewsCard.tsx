"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquareQuote, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getDriverReviews } from "@/lib/actions/review.actions"

interface ReviewItem {
  _id: string
  riderId: { _id: string; name: string; picture?: string }
  rating: number
  comment?: string
  createdAt: string
}

interface RecentReviewsCardProps {
  driverId: string
  accessToken: string
}

export function RecentReviewsCard({ driverId, accessToken }: RecentReviewsCardProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!driverId || !accessToken) return

    getDriverReviews(driverId, accessToken, 1, 5)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setReviews(res.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [driverId, accessToken])

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
            }`}
          />
        ))}
      </div>
    )
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Recent Reviews
        </CardTitle>
        {reviews.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Latest {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquareQuote className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No reviews yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Reviews from riders will appear here after rides are completed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div
                key={review._id}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {review.riderId?.picture ? (
                    <img
                      src={review.riderId.picture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-primary/60" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">
                      {review.riderId?.name || "Anonymous"}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="mt-0.5">{renderStars(review.rating)}</div>
                  {review.comment && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
