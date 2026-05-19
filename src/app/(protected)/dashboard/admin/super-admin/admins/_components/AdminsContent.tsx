"use client"

import { useState } from "react"
import { Shield, Trash2, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { adminGetUsers, adminCreateAdmin, adminRemoveAdmin } from "@/lib/actions/admin.actions"

interface AdminUser {
  _id: string
  name: string
  email: string
  role: string
  phone?: string
  createdAt: string
}

interface AdminsContentProps {
  initialAdmins: AdminUser[]
  accessToken: string
}

export function AdminsContent({ initialAdmins, accessToken }: AdminsContentProps) {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" })
  const [formError, setFormError] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  function fetchAdmins() {
    setLoading(true)
    adminGetUsers(accessToken, { role: "ADMIN", limit: "50" }).then((res) => {
      if (res.success) setAdmins(res.data)
      setLoading(false)
    })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")
    setFormLoading(true)

    const res = await adminCreateAdmin(accessToken, formData)
    if (res.success) {
      setShowForm(false)
      setFormData({ name: "", email: "", password: "", phone: "" })
      fetchAdmins()
    } else {
      setFormError(res.message || "Failed to create admin")
    }
    setFormLoading(false)
  }

  async function handleRemove(adminId: string) {
    setActionLoading(adminId)
    const res = await adminRemoveAdmin(accessToken, adminId)
    if (res.success) {
      setAdmins((prev) => prev.filter((a) => a._id !== adminId))
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Create and remove admin accounts.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1.5" />
          {showForm ? "Cancel" : "Create Admin"}
        </Button>
      </div>

      {/* Create Admin Form */}
      {showForm && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleCreate} className="space-y-4 max-w-md">
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                required
              />
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                placeholder="Email Address"
                required
              />
              <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                placeholder="Password (min 6 chars)"
                required
                minLength={6}
              />
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone Number (optional)"
              />
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <Button type="submit" variant="primary" disabled={formLoading}>
                {formLoading ? "Creating..." : "Create Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Shield className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No admin accounts</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium text-muted-foreground px-5 py-3">Name</th>
                    <th className="text-left font-medium text-muted-foreground px-5 py-3">Email</th>
                    <th className="text-left font-medium text-muted-foreground px-5 py-3">Phone</th>
                    <th className="text-left font-medium text-muted-foreground px-5 py-3">Created</th>
                    <th className="text-right font-medium text-muted-foreground px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">{admin.name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{admin.email}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{admin.phone || "—"}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actionLoading === admin._id}
                          onClick={() => handleRemove(admin._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
