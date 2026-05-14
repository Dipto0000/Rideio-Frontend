"use client"

import { useState, useEffect } from "react"
import { Star, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createReview, getRideReview } from "@/lib/actions/review.actions"

interface ReviewDialogProps {
  rideId: string
  driverName?: string
  accessToken: string
  onReviewSubmitted?: () => void
}

export function ReviewDialog({ rideId, driverName, accessToken, onReviewSubmitted }: ReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [checkingReview, setCheckingReview] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isOpen) return
    setCheckingReview(true)
    setError("")
    setAlreadyReviewed(false)
    setSubmitted(false)

    getRideReview(rideId, accessToken).then((res) => {
      if (res.success && res.data) {
        setAlreadyReviewed(true)
      }
      setCheckingReview(false)
    }).catch(() => {
      setCheckingReview(false)
    })
  }, [isOpen, rideId, accessToken])

  async function handleSubmit() {
    if (rating === 0) return
    setLoading(true)
    setError("")

    const res = await createReview({ rideId, rating, comment: comment.trim() || undefined }, accessToken)

    setLoading(false)

    if (res.success) {
      setSubmitted(true)
      onReviewSubmitted?.()
    } else {
      setError(res.message || "Failed to submit review")
    }
  }

  function handleOpen() {
    setRating(0)
    setComment("")
    setError("")
    setSubmitted(false)
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="w-full"
      >
        <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
        Leave a Review
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div
        className="bg-background rounded-xl shadow-2xl border border-border w-full max-w-md mx-4 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-lg font-semibold">Review Submitted!</p>
            <p className="text-sm text-muted-foreground text-center">
              Thank you for your feedback{driverName ? ` about ${driverName}` : ""}.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : checkingReview ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : alreadyReviewed ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
            <p className="text-lg font-semibold">Already Reviewed</p>
            <p className="text-sm text-muted-foreground text-center">
              You have already submitted a review for this ride.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Rate Your Ride</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {driverName && (
              <p className="text-sm text-muted-foreground -mt-2">
                How was your ride with <span className="font-medium text-foreground">{driverName}</span>?
              </p>
            )}

            {/* Star rating */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform duration-150 hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-150 ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-sm font-medium text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Great"}
                {rating === 5 && "Excellent!"}
              </p>
            )}

            {/* Comment */}
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                maxLength={500}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow"
              />
              <p className="text-xs text-muted-foreground/60 mt-1 text-right">{comment.length}/500</p>
            </div>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={rating === 0 || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
