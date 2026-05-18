"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AlertTriangle, Trash2, User, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { adminGetDeletedRecords } from "@/lib/actions/admin.actions"
import type { PaginationMeta } from "@/types"

interface DeletedRecord {
  _id: string
  originalModel: string
  originalId: string
  deletedBy: { _id: string; name: string; email: string }
  reason?: string
  deletedAt: string
}

export default function AdminDeletedRecordsPage() {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const [records, setRecords] = useState<DeletedRecord[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  function fetchRecords(p: number) {
    if (!session?.user.accessToken) return
    setLoading(true)
    adminGetDeletedRecords(session.user.accessToken, { page: String(p), limit: "10" }).then((res) => {
      if (res.success) {
        setRecords(res.data)
        setMeta(res.meta)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchRecords(page)
  }, [accessToken, page]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Deleted Records</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Audit log of all soft-deleted resources.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Trash2 className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No deleted records</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Deleted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {r.originalModel === "User" ? (
                            <User className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Car className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Badge variant="secondary">{r.originalModel}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.deletedBy?.name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground italic">{r.reason || "—"}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(r.deletedAt).toLocaleDateString("en-BD", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
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
