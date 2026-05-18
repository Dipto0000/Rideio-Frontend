"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AlertTriangle, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/modules/Dashboard/Pagination"
import { adminGetSubscriptions, adminUpdatePaymentStatus } from "@/lib/actions/admin.actions"
import type { PaginationMeta } from "@/types"

const statusBadgeVariant: Record<string, string> = {
  SUCCESS: "success",
  PENDING: "warning",
  FAILED: "destructive",
  CANCELLED: "outline",
}

interface PaymentItem {
  _id: string
  userId: { _id: string; name: string; email: string }
  amount: number
  currency: string
  status: string
  planType: string
  sslcommerzTxnNo?: string
  method: string
  createdAt: string
}

export default function AdminSubscriptionsPage() {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  function fetchPayments(p: number) {
    if (!session?.user.accessToken) return
    setLoading(true)
    adminGetSubscriptions(session.user.accessToken, { page: String(p), limit: "10" }).then((res) => {
      if (res.success) {
        setPayments(res.data)
        setMeta(res.meta)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchPayments(page)
  }, [accessToken, page]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusUpdate(paymentId: string, status: string) {
    if (!session?.user.accessToken) return
    setActionLoading(paymentId)
    const res = await adminUpdatePaymentStatus(session.user.accessToken, paymentId, status)
    if (res.success) {
      setPayments((prev) => prev.map((p) => (p._id === paymentId ? { ...p, status } : p)))
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-0.5">View and manage payment records.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <CreditCard className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No payment records found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{p.userId?.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{p.userId?.email}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.planType}</TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{p.amount} {p.currency}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {p.sslcommerzTxnNo || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={(statusBadgeVariant[p.status] as any) || "outline"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {p.status === "PENDING" && (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading === p._id}
                              onClick={() => handleStatusUpdate(p._id, "SUCCESS")}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading === p._id}
                              onClick={() => handleStatusUpdate(p._id, "FAILED")}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                            >
                              Fail
                            </Button>
                          </div>
                        )}
                        {(p.status === "SUCCESS" || p.status === "FAILED") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === p._id}
                            onClick={() => handleStatusUpdate(p._id, "CANCELLED")}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {meta && <Pagination page={meta.page} totalPage={meta.totalPage} onPageChange={setPage} />}
    </div>
  )
}
