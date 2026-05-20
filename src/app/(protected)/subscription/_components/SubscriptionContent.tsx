"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, CreditCard, Clock, History, Loader2, XCircle, RefreshCw } from "lucide-react"
import { initiatePayment, cancelPendingPayment } from "@/lib/actions/subscription.actions"
import type { SubscriptionStatus, PaymentRecord, PaginationMeta } from "@/types"

interface Props {
  initialStatus: SubscriptionStatus | null
  initialPayments: PaymentRecord[]
  initialMeta: PaginationMeta | null
}

export function SubscriptionContent({ initialStatus, initialPayments }: Props) {
  const { data: session } = useSession()
  const [paying, setPaying] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [status] = useState<SubscriptionStatus | null>(initialStatus)
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments)
  const [error, setError] = useState("")

  const isSubscribed = status?.isSubscribed ?? session?.user.isSubscribed ?? false
  const expiryDate = status?.expiryDate

  const hasPending = payments.some((p) => p.status === "PENDING")

  async function handleSubscribe() {
    if (!session?.user.accessToken) return
    setPaying(true)
    setError("")

    // If there's a pending payment, cancel it first
    if (hasPending) {
      const cancelRes = await cancelPendingPayment(session.user.accessToken)
      if (!cancelRes.success) {
        setError(cancelRes.message || "Failed to cancel previous pending payment")
        setPaying(false)
        return
      }
      setPayments((prev) =>
        prev.map((p) => (p.status === "PENDING" ? { ...p, status: "CANCELLED" as const } : p))
      )
    }

    const res = await initiatePayment(session.user.accessToken)
    if (!res.success) {
      setError(res.message || "Payment initiation failed")
      setPaying(false)
      return
    }

    window.location.href = res.data.gatewayUrl
  }

  async function handleCancelPending() {
    if (!session?.user.accessToken) return
    setCancelling(true)
    setError("")

    const res = await cancelPendingPayment(session.user.accessToken)
    if (!res.success) {
      setError(res.message || "Failed to cancel pending payment")
      setCancelling(false)
      return
    }

    // Mark pending payments as cancelled in local state
    setPayments((prev) =>
      prev.map((p) => (p.status === "PENDING" ? { ...p, status: "CANCELLED" as const } : p))
    )
    setCancelling(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Subscribe to start accepting ride requests as a Driver.
        </p>
      </div>

      {/* Active Status Banner */}
      {isSubscribed && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="font-semibold text-primary">Subscription Active</p>
            {expiryDate && (
              <p className="text-sm text-muted-foreground">
                Expires: {new Date(expiryDate).toLocaleDateString("en-BD", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Plan Card */}
      <Card className="border-secondary/30">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-primary">Driver Plan</CardTitle>
          <CardDescription>Everything you need to start earning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">৳700</p>
            <p className="text-sm text-muted-foreground mt-1">per month</p>
          </div>

          <ul className="space-y-3 max-w-sm mx-auto">
            {[
              { icon: CreditCard, text: "Accept unlimited ride requests" },
              { icon: Shield, text: "Access to rider contact information" },
              { icon: History, text: "Full ride history & earnings dashboard" },
              { icon: Clock, text: "Cancel anytime, access until expiry" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <Icon className="w-4 h-4 text-secondary shrink-0" />
                {text}
              </li>
            ))}
          </ul>

          {error && (
            <div className="space-y-3">
              <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
              {error.toLowerCase().includes("pending payment") && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancelPending}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Previous Payment & Retry
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          <Button
            variant="primary"
            className="w-full h-12 text-base"
            onClick={handleSubscribe}
            disabled={paying || isSubscribed}
          >
            {paying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting to SSLCommerz...
              </>
            ) : isSubscribed ? (
              "Already Subscribed"
            ) : hasPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Cancel Pending & Subscribe
              </>
            ) : (
              "Subscribe Now — ৳700/month"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment via <strong>SSLCommerz</strong>. You will be redirected to the payment gateway.
          </p>
        </CardContent>
      </Card>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <History className="w-5 h-5" />
            Payment History
          </h2>
          <div className="space-y-2">
            {payments.map((p) => (
              <Card key={p._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      ৳{p.amount} — {p.planType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                      {p.sslcommerzTxnNo && ` · ${p.sslcommerzTxnNo}`}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    p.status === "SUCCESS" ? "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300" :
                    p.status === "CANCELLED" ? "bg-gray-50 text-gray-500 dark:bg-gray-900/60 dark:text-gray-300" :
                    p.status === "FAILED" ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300" :
                    "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}>
                    {p.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
