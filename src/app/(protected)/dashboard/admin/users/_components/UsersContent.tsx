"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Trash2, Users as UsersIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { adminGetUsers, adminSoftDeleteUser } from "@/lib/actions/admin.actions"
import type { PaginationMeta } from "@/types"

interface UserItem {
  _id: string
  name: string
  email: string
  picture?: string
  role: string
  subRole: string
  status: string
  isVerified: boolean
  isSubscribed: boolean
  createdAt: string
}

interface UsersContentProps {
  initialUsers: UserItem[]
  initialMeta: PaginationMeta | null
  accessToken: string
}

export function UsersContent({ initialUsers, initialMeta, accessToken }: UsersContentProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstRender = useRef(true)

  const fetchUsers = useCallback((p: number, s: string) => {
    setLoading(true)
    const query: Record<string, string> = { page: String(p), limit: "10" }
    if (s) query.searchTerm = s
    adminGetUsers(accessToken, query).then((res) => {
      if (res.success) {
        setUsers(res.data)
        setMeta(res.meta)
      }
      setLoading(false)
    })
  }, [accessToken])

  // Handle page change (skip initial render since data is server-fetched)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    fetchUsers(page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Debounced search
  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchUsers(1, value)
    }, 350)
  }

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  async function handleDelete(userId: string) {
    setActionLoading(userId)
    const res = await adminSoftDeleteUser(accessToken, userId)
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u._id !== userId))
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage all registered users.</p>
      </div>

      {/* Search with debounce */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="pl-9 h-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <UsersIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No users found</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 shrink-0 border border-border">
                            <AvatarImage src={user.picture || ""} alt={user.name} />
                            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                              {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.subRole?.toLowerCase() || "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        {user.role === "USER" ? (
                          <Badge variant="secondary">
                            {user.subRole || "User"}
                          </Badge>
                        ) : (
                          <Badge variant={
                            user.role === "SUPER_ADMIN" ? "destructive" :
                            user.role === "ADMIN" ? "info" :
                            "secondary"
                          }>
                            {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isVerified ? "success" : "warning"}>
                          {user.isVerified ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "ACTIVE" ? "success" : "destructive"}>
                          {user.status?.toLowerCase() || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role === "USER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === user._id}
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="w-4 h-4" />
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
